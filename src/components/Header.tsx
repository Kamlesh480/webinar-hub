import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <img
              src="https://website-assets.atlan.com/img/atlan-blue.svg"
              alt="Atlan Logo"
              width={80}
              height={25}
              loading="eager"
              fetchPriority="high"
              style={{ width: '80px', height: '25px' }}
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Webinars
            </Link>
            <a href="https://atlan.com" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Product
            </a>
            <a href="https://atlan.com" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Resources
            </a>
            <a href="https://atlan.com" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Company
            </a>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="sm">Sign In</Button>
            <Button size="sm" className="bg-gradient-to-r from-primary to-secondary hover:opacity-90">
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-4 border-t border-border">
            <Link
              to="/"
              className="block text-sm font-medium text-foreground hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Webinars
            </Link>
            <a href="https://atlan.com" className="block text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Product
            </a>
            <a href="https://atlan.com" className="block text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Resources
            </a>
            <a href="https://atlan.com" className="block text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Company
            </a>
            <div className="pt-4 space-y-2">
              <Button variant="ghost" size="sm" className="w-full">Sign In</Button>
              <Button size="sm" className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90">
                Get Started
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
