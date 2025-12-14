import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Activity, 
  Calendar, 
  User, 
  Settings, 
  LogOut,
  Heart,
  LucideIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Activity, label: 'Activities', path: '/activities' },
  { icon: Calendar, label: 'Calendar', path: '/calendar' },
  { icon: User, label: 'Profile', path: '/profile' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

// Top spacer - creates rounded bottom-right corner above active item
const TopSpacer = ({ isActive }: { isActive: boolean }) => (
  <div 
    className={cn(
      "w-full transition-all duration-200",
      isActive ? "h-4 bg-primary rounded-br-[32px]" : "h-0"
    )}
  />
);

// Bottom spacer - creates rounded top-right corner below active item
const BottomSpacer = ({ isActive }: { isActive: boolean }) => (
  <div 
    className={cn(
      "w-full transition-all duration-200",
      isActive ? "h-4 bg-primary rounded-tr-[32px]" : "h-0"
    )}
  />
);

// Menu item wrapper containing spacers and the actual menu item
interface MenuItemWrapperProps {
  icon: LucideIcon;
  label: string;
  path: string;
  isActive: boolean;
}

const MenuItemWrapper = ({ icon: Icon, label, path, isActive }: MenuItemWrapperProps) => (
  <div className="flex flex-col">
    <TopSpacer isActive={isActive} />
    <NavLink
      to={path}
      className={cn(
        "flex items-center gap-3 h-[52px] w-full pl-4 transition-all duration-200 rounded-[20px]",
        isActive 
          ? "bg-background text-foreground font-medium !rounded-tl-[20px] !rounded-bl-[20px] !rounded-tr-none !rounded-br-none" 
          : "text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
      )}
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </NavLink>
    <BottomSpacer isActive={isActive} />
  </div>
);

export const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-background flex flex-col z-50 overflow-hidden p-4">
      {/* Logo */}
      <div className="flex items-center gap-3 px-2 py-4">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
          <Heart className="w-6 h-6 text-primary-foreground" />
        </div>
        <span className="text-2xl font-semibold text-foreground">Wellora</span>
      </div>

      {/* NavRail - The rounded container for navigation */}
      <nav className="flex-1 bg-primary rounded-3xl p-2 overflow-hidden">
        <div className="flex flex-col">
          {navItems.map((item) => (
            <MenuItemWrapper
              key={item.path}
              icon={item.icon}
              label={item.label}
              path={item.path}
              isActive={location.pathname === item.path}
            />
          ))}
        </div>
      </nav>

      {/* Logout */}
      <div className="pt-4">
        <button className="flex items-center gap-3 px-4 py-3 w-full text-muted-foreground hover:text-foreground transition-colors rounded-2xl hover:bg-muted">
          <LogOut className="w-5 h-5" />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
};
