import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Download, RefreshCw, Trash2, FileImage, Archive } from "lucide-react";
import { convertToJPG } from "@/lib/image-converter";
import { formatFileSize } from "@/lib/file-utils";
import ConversionProgress from "./conversion-progress";
import JSZip from 'jszip';

interface FileConverterProps {
  files: File[];
  onClear: () => void;
}

interface ConversionResult {
  file: File;
  status: 'pending' | 'converting' | 'success' | 'error';
  progress: number;
  result?: Blob;
  error?: string;
}

export default function FileConverter({ files, onClear }: FileConverterProps) {
  const [results, setResults] = useState<ConversionResult[]>([]);
  const [isConverting, setIsConverting] = useState(false);

  useEffect(() => {
    // Initialize results
    const initialResults: ConversionResult[] = files.map(file => ({
      file,
      status: 'pending',
      progress: 0
    }));
    setResults(initialResults);
  }, [files]);

  const startConversion = async () => {
    setIsConverting(true);
    
    for (let i = 0; i < results.length; i++) {
      const result = results[i];
      
      // Update status to converting
      setResults(prev => prev.map((r, index) => 
        index === i ? { ...r, status: 'converting' as const, progress: 0 } : r
      ));
      
      try {
        const convertedBlob = await convertToJPG(result.file, (progress) => {
          setResults(prev => prev.map((r, index) => 
            index === i ? { ...r, progress } : r
          ));
        });
        
        setResults(prev => prev.map((r, index) => 
          index === i ? { 
            ...r, 
            status: 'success' as const, 
            progress: 100, 
            result: convertedBlob 
          } : r
        ));
      } catch (error) {
        setResults(prev => prev.map((r, index) => 
          index === i ? { 
            ...r, 
            status: 'error' as const, 
            progress: 0,
            error: error instanceof Error ? error.message : 'Conversion failed'
          } : r
        ));
      }
    }
    
    setIsConverting(false);
  };

  const downloadFile = (result: ConversionResult) => {
    if (!result.result) return;
    
    const url = URL.createObjectURL(result.result);
    const a = document.createElement('a');
    a.href = url;
    a.download = result.file.name.replace(/\.[^/.]+$/, '') + '.jpg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadAll = () => {
    const successfulResults = results.filter(r => r.status === 'success' && r.result);
    successfulResults.forEach(downloadFile);
  };

  const downloadAllAsZip = async () => {
    const successfulResults = results.filter(r => r.status === 'success' && r.result);
    if (successfulResults.length === 0) return;

    const zip = new JSZip();
    
    for (const result of successfulResults) {
      const fileName = `${result.file.name.replace(/\.[^/.]+$/, '')}.jpg`;
      zip.file(fileName, result.result!);
    }
    
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quickjpg-converted-${new Date().toISOString().split('T')[0]}.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const hasSuccessfulConversions = results.some(r => r.status === 'success');
  const allCompleted = results.every(r => r.status === 'success' || r.status === 'error');

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Convert to JPG</CardTitle>
            <Badge variant="outline">
              {files.length} file{files.length !== 1 ? 's' : ''}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button 
              onClick={startConversion}
              disabled={isConverting || allCompleted}
              className="flex-1"
            >
              {isConverting ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Converting...
                </>
              ) : (
                'Start Conversion'
              )}
            </Button>
            
            {hasSuccessfulConversions && (
              <>
                <Button onClick={downloadAll} variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download All
                </Button>
                <Button onClick={downloadAllAsZip} variant="outline">
                  <Archive className="h-4 w-4 mr-2" />
                  Download ZIP
                </Button>
              </>
            )}
            
            <Button onClick={onClear} variant="outline">
              <Trash2 className="h-4 w-4 mr-2" />
              Clear
            </Button>
          </div>
          
          <Separator />
          
          <div className="space-y-3">
            {results.map((result, index) => (
              <div key={index} className="file-thumbnail">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileImage className="h-6 w-6 text-muted-foreground" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium truncate">
                        {result.file.name}
                      </p>
                      <Badge variant={
                        result.status === 'success' ? 'default' :
                        result.status === 'error' ? 'destructive' :
                        result.status === 'converting' ? 'secondary' :
                        'outline'
                      }>
                        {result.status}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{formatFileSize(result.file.size)}</span>
                      <span>•</span>
                      <span>{result.file.type}</span>
                    </div>
                    
                    {result.status === 'converting' && (
                      <div className="mt-2">
                        <Progress value={result.progress} className="h-2" />
                      </div>
                    )}
                    
                    {result.error && (
                      <p className="text-xs text-destructive mt-1">
                        {result.error}
                      </p>
                    )}
                  </div>
                  
                  {result.status === 'success' && result.result && (
                    <Button
                      size="sm"
                      onClick={() => downloadFile(result)}
                      variant="outline"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
