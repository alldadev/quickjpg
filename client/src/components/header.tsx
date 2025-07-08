import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useProStatus } from "@/hooks/use-pro-status";
import { useTheme } from "@/contexts/theme-context";
import { Zap, Sun, Moon } from "lucide-react";

export default function Header() {
  const { isPro } = useProStatus();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <a href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Zap className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">QuickJPG</span>
            </a>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="h-8 w-8 p-0"
            >
              {theme === 'light' ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
            </Button>
            
            {isPro ? (
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                Pro Active
              </Badge>
            ) : (
              <Button asChild size="sm">
                <a href="/subscribe">Go Pro</a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
