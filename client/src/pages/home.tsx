import { useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import FileUploadZone from "@/components/file-upload-zone";
import FileConverter from "@/components/file-converter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Zap, Users, Star } from "lucide-react";

export default function Home() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFilesSelected = (files: File[]) => {
    setSelectedFiles(files);
  };

  const handleFilesCleared = () => {
    setSelectedFiles([]);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge variant="secondary" className="mb-4 text-sm px-4 py-2 border-2 border-border/50">
            <Shield className="h-4 w-4 mr-2" />
            Files never leave your browser
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
            Convert Images to JPG
            <span className="text-primary"> Instantly</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-muted-foreground max-w-2xl mx-auto">
            Transform HEIC, WEBP, and PNG files to JPG format entirely in your browser. 
            Fast, free, and completely private.
          </p>
          
          {/* AdSense Placeholder */}
          {import.meta.env.VITE_IS_PRO !== 'true' && (
            <div className="mb-8">
              {/* ADSENSE */}
            </div>
          )}
          
          {selectedFiles.length === 0 ? (
            <FileUploadZone onFilesSelected={handleFilesSelected} />
          ) : (
            <FileConverter files={selectedFiles} onClear={handleFilesCleared} />
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose QuickJPG?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Privacy First</h3>
                <p className="text-muted-foreground">
                  All processing happens locally in your browser. No files are uploaded to servers.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
                <p className="text-muted-foreground">
                  Instant conversion without server delays. No waiting, no queues.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No Sign-up Required</h3>
                <p className="text-muted-foreground">
                  Start converting immediately. Drag & drop up to 5 images for free.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 px-4 bg-muted/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Simple Pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="relative">
              <CardContent className="pt-6">
                <h3 className="text-2xl font-bold mb-2">Free</h3>
                <div className="text-4xl font-bold text-primary mb-4">$0</div>
                <ul className="text-left space-y-2 mb-6">
                  <li className="flex items-center">
                    <Star className="h-4 w-4 text-primary mr-2" />
                    Up to 5 files at once
                  </li>
                  <li className="flex items-center">
                    <Star className="h-4 w-4 text-primary mr-2" />
                    All conversion formats
                  </li>
                  <li className="flex items-center">
                    <Star className="h-4 w-4 text-primary mr-2" />
                    100% privacy guaranteed
                  </li>
                </ul>
                <Button variant="outline" className="w-full">
                  Start Converting
                </Button>
              </CardContent>
            </Card>
            
            <Card className="relative border-primary">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
              </div>
              <CardContent className="pt-6">
                <h3 className="text-2xl font-bold mb-2">QuickJPG Pro</h3>
                <div className="text-4xl font-bold text-primary mb-4">$9.99</div>
                <ul className="text-left space-y-2 mb-6">
                  <li className="flex items-center">
                    <Star className="h-4 w-4 text-primary mr-2" />
                    Up to 20 files at once
                  </li>
                  <li className="flex items-center">
                    <Star className="h-4 w-4 text-primary mr-2" />
                    Priority processing
                  </li>
                  <li className="flex items-center">
                    <Star className="h-4 w-4 text-primary mr-2" />
                    No ads
                  </li>
                  <li className="flex items-center">
                    <Star className="h-4 w-4 text-primary mr-2" />
                    Cancel anytime
                  </li>
                </ul>
                <Button asChild className="w-full">
                  <a href="/subscribe">Go Pro</a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Trusted by Users Worldwide</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">100%</div>
              <p className="text-muted-foreground">Client-side Processing</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">Fast</div>
              <p className="text-muted-foreground">Instant Conversion</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">Free</div>
              <p className="text-muted-foreground">No Hidden Costs</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
