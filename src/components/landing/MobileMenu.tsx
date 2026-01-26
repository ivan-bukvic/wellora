import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileMenuProps {
  className?: string;
}

const MobileMenu = ({ className }: MobileMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleNavClick = (id: string) => {
    setIsOpen(false);
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className={cn("md:hidden", className)}>
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 -mr-2 text-foreground/70 hover:text-primary transition-colors"
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Menu Overlay */}
      <div
        className={cn(
          "fixed inset-0 top-[72px] z-50 bg-background/98 backdrop-blur-sm transition-all duration-300 ease-out",
          isOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        )}
      >
        <nav className="flex flex-col p-6 space-y-2">
          <button
            onClick={() => handleNavClick('how-it-works')}
            className="w-full text-left py-4 px-4 text-lg font-medium text-foreground/80 hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
          >
            How it works
          </button>
          <button
            onClick={() => handleNavClick('testimonials')}
            className="w-full text-left py-4 px-4 text-lg font-medium text-foreground/80 hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
          >
            Testimonials
          </button>
          <button
            onClick={() => handleNavClick('faq')}
            className="w-full text-left py-4 px-4 text-lg font-medium text-foreground/80 hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
          >
            FAQ
          </button>
          
          <div className="pt-4 border-t border-border/50">
            <Link
              to="/auth?mode=signup"
              onClick={() => setIsOpen(false)}
              className="block w-full py-4 px-4 text-lg font-medium text-primary hover:bg-primary/5 rounded-xl transition-all"
            >
              Sign up
            </Link>
            <Link
              to="/auth?mode=signup"
              onClick={() => setIsOpen(false)}
              className="block w-full mt-2 py-4 px-4 text-lg font-medium text-center bg-primary text-white rounded-xl hover:bg-primary/90 transition-all"
            >
              Get Started
            </Link>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default MobileMenu;