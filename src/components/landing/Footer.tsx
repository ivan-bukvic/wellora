import { Link } from "react-router-dom";
import welloraIcon from "@/assets/wellora-icon.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="max-w-[1164px] mx-auto px-6 pt-8 pb-12 md:pt-12 md:pb-16">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Logo + Brand */}
        <Link to="/" className="flex items-center gap-2">
          <img 
            src={welloraIcon} 
            alt="Wellora logo" 
            className="h-9 w-auto object-contain"
            style={{ filter: 'brightness(0) saturate(100%) invert(76%) sepia(45%) saturate(600%) hue-rotate(170deg) brightness(100%) contrast(95%)' }}
          />
          <span className="text-[1.15rem] font-semibold text-primary tracking-tight">
            Wellora
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center gap-6 md:gap-8">
          <Link 
            to="/" 
            className="text-[0.9rem] text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            Product
          </Link>
          <Link 
            to="/" 
            className="text-[0.9rem] text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            Privacy
          </Link>
          <Link 
            to="/" 
            className="text-[0.9rem] text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            Terms
          </Link>
          <Link 
            to="/" 
            className="text-[0.9rem] text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            Contact
          </Link>
        </nav>

        {/* Copyright */}
        <p className="text-[0.85rem] text-muted-foreground/70">
          © {currentYear} Wellora
        </p>
      </div>
    </footer>
  );
};

export default Footer;
