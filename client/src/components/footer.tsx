import { Separator } from "@/components/ui/separator";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-semibold mb-4">QuickJPG</h3>
            <p className="text-sm text-muted-foreground">
              Privacy-focused image conversion. Convert HEIC, WEBP, and PNG to JPG 
              entirely in your browser.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/privacy" className="text-muted-foreground hover:text-foreground">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms" className="text-muted-foreground hover:text-foreground">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="/contact" className="text-muted-foreground hover:text-foreground">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/help" className="text-muted-foreground hover:text-foreground">
                  Help Center
                </a>
              </li>
              <li>
                <a href="/faq" className="text-muted-foreground hover:text-foreground">
                  FAQ
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <Separator className="my-6" />
        
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © 2024 QuickJPG. All rights reserved.
          </p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <span className="text-sm text-muted-foreground">
              Files never leave your browser
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
