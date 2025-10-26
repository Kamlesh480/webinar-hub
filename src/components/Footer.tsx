import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <img
              src="https://website-assets.atlan.com/img/atlan-blue.svg"
              alt="Atlan Logo"
              width={80}
              height={25}
              loading="eager"
              fetchPriority="high"
              style={{ width: '80px', height: '25px' }}
            />
            </div>
            <p className="text-sm text-muted-foreground">
              Modern data workspace for collaboration, governance, and discovery.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Product</h3>
            <ul className="space-y-2">
              <li><a href="https://atlan.com" className="text-sm text-muted-foreground hover:text-primary transition-colors">Features</a></li>
              <li><a href="https://atlan.com" className="text-sm text-muted-foreground hover:text-primary transition-colors">Integrations</a></li>
              <li><a href="https://atlan.com" className="text-sm text-muted-foreground hover:text-primary transition-colors">Pricing</a></li>
              <li><a href="https://atlan.com" className="text-sm text-muted-foreground hover:text-primary transition-colors">Security</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">Webinars</Link></li>
              <li><a href="https://atlan.com" className="text-sm text-muted-foreground hover:text-primary transition-colors">Documentation</a></li>
              <li><a href="https://atlan.com" className="text-sm text-muted-foreground hover:text-primary transition-colors">Blog</a></li>
              <li><a href="https://atlan.com" className="text-sm text-muted-foreground hover:text-primary transition-colors">Community</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Company</h3>
            <ul className="space-y-2">
              <li><a href="https://atlan.com" className="text-sm text-muted-foreground hover:text-primary transition-colors">About</a></li>
              <li><a href="https://atlan.com" className="text-sm text-muted-foreground hover:text-primary transition-colors">Careers</a></li>
              <li><a href="https://atlan.com" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contact</a></li>
              <li><a href="https://atlan.com" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground text-center">
            © 2025 Atlan. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
