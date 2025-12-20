import { LucideProps } from 'lucide-react';

const StretchingIcon = ({ size = 24, color = 'currentColor', strokeWidth = 2, ...props }: LucideProps) => {
  const sizeNum = typeof size === 'string' ? parseInt(size, 10) : size;
  
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={sizeNum}
      height={sizeNum}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {/* Head */}
      <circle cx="12" cy="4" r="2" />
      {/* Body - person doing side stretch with arm raised */}
      <path d="M12 6v6" />
      {/* Left arm reaching up and over (stretch) */}
      <path d="M12 8c-2 0-4-1-5-2" />
      {/* Right arm raised overhead in stretch */}
      <path d="M12 8c1.5 0 3 2 4 4" />
      {/* Left leg */}
      <path d="M12 12l-3 6" />
      {/* Right leg */}
      <path d="M12 12l3 6" />
    </svg>
  );
};

export default StretchingIcon;
