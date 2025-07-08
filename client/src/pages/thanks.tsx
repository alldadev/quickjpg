import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Header from "@/components/header";

export default function Thanks() {
  useEffect(() => {
    // Set Pro status in localStorage
    localStorage.setItem('quickjpg_pro', 'true');
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="py-12 px-4">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="h-8 w-8 text-primary" />
              </div>
              <CardTitle>Welcome to QuickJPG Pro!</CardTitle>
              <p className="text-muted-foreground">
                Your subscription has been activated successfully.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Pro Features Unlocked:</h3>
                <ul className="text-sm space-y-1">
                  <li>• Convert up to 20 files at once</li>
                  <li>• Priority processing</li>
                  <li>• No advertisements</li>
                  <li>• Cancel anytime</li>
                </ul>
              </div>
              
              <Button asChild className="w-full">
                <a href="/">Start Converting</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
