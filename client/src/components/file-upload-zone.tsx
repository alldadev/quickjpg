import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, FileImage, AlertCircle } from "lucide-react";
import { useProStatus } from "@/hooks/use-pro-status";
import { isValidImageFile } from "@/lib/file-utils";

interface FileUploadZoneProps {
  onFilesSelected: (files: File[]) => void;
}

export default function FileUploadZone({ onFilesSelected }: FileUploadZoneProps) {
  const { isPro } = useProStatus();
  const [error, setError] = useState<string | null>(null);
  
  const maxFiles = isPro ? 20 : 5;
  
  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    setError(null);
    
    if (rejectedFiles.length > 0) {
      setError("Some files were rejected. Please only upload HEIC, WEBP, or PNG files.");
      return;
    }
    
    const validFiles = acceptedFiles.filter(isValidImageFile);
    
    if (validFiles.length !== acceptedFiles.length) {
      setError("Some files are not supported. Only HEIC, WEBP, and PNG files are allowed.");
      return;
    }
    
    if (validFiles.length > maxFiles) {
      setError(`You can only upload up to ${maxFiles} files at once. ${isPro ? '' : 'Upgrade to Pro for up to 20 files.'}`);
      return;
    }
    
    if (validFiles.length === 0) {
      setError("Please select at least one valid image file.");
      return;
    }
    
    onFilesSelected(validFiles);
  }, [maxFiles, isPro, onFilesSelected]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/heic': ['.heic', '.HEIC'],
      'image/webp': ['.webp'],
      'image/png': ['.png']
    },
    maxFiles
  });

  return (
    <div className="max-w-2xl mx-auto">
      <Card className={`drag-zone ${isDragActive ? 'drag-over' : ''}`}>
        <CardContent className="pt-6">
          <div {...getRootProps()} className="cursor-pointer">
            <input {...getInputProps()} />
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Upload className="h-8 w-8 text-primary" />
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  {isDragActive ? 'Drop files here' : 'Drag & drop your images'}
                </h3>
                <p className="text-muted-foreground mb-4">
                  or click to browse files
                </p>
                
                <Button variant="outline" size="lg">
                  <FileImage className="h-4 w-4 mr-2" />
                  Choose Files
                </Button>
              </div>
              
              <div className="text-sm text-muted-foreground space-y-2">
                <p>Supported formats: HEIC, WEBP, PNG</p>
                <p>Maximum {maxFiles} files {!isPro && '(Pro: 20 files)'}</p>
                <p className="trust-badge text-sm font-medium">
                  <span className="w-2 h-2 bg-green-500 rounded-full inline-block mr-2"></span>
                  Files never leave your browser
                </p>
              </div>
            </div>
          </div>
          
          {error && (
            <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0" />
              <span className="text-sm text-destructive">{error}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
