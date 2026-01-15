import { Link } from "react-router-dom";
import welloraIcon from "@/assets/wellora-icon.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="max-w-[1164px] mx-auto px-4 sm:px-6 pt-6 pb-8 md:pt-8 md:pb-12 lg:pt-12 lg:pb-16">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-8">
        {/* Logo + Brand */}
        <Link to="/" className="flex items-center gap-2">
          <img src={welloraIcon} alt="Wellora logo" className="h-8 md:h-9 w-auto object-contain" style={{
            filter: 'brightness(0) saturate(100%) invert(76%) sepia(45%) saturate(600%) hue-rotate(170deg) brightness(100%) contrast(95%)'
          }} />
          <span className="text-base md:text-[1.15rem] font-semibold text-primary tracking-tight">
            Wellora
          </span>
        </Link>

        {/* Copyright */}
        <p className="text-xs md:text-[0.85rem] text-muted-foreground/70">
          © {currentYear} Wellora
        </p>
      </div>
    </footer>
  );
};

export default Footer;