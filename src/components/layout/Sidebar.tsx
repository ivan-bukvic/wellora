import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Activity, 
  Calendar, 
  User, 
  Settings, 
  LogOut,
  Heart
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Activity, label: 'Activities', path: '/activities' },
  { icon: Calendar, label: 'Calendar', path: '/calendar' },
  { icon: User, label: 'Profile', path: '/profile' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

// Spacer component that creates the rounded corner effect
const RoundedSpacer = ({ position }: { position: 'top' | 'bottom' }) => (
  <div 
    className={cn(
      "h-[30px] w-full bg-background",
      position === 'top' ? "rounded-br-[30px]" : "rounded-tr-[30px]"
    )}
  />
);

export const Sidebar = () => {
  const location = useLocation();
  const activeIndex = navItems.findIndex(item => item.path === location.pathname);

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-primary flex flex-col z-50">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-8">
        <div className="w-10 h-10 bg-primary-foreground/20 rounded-xl flex items-center justify-center">
          <Heart className="w-6 h-6 text-primary-foreground" />
        </div>
        <span className="text-2xl font-semibold text-primary-foreground">Wellora</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4">
        <div className="flex flex-col">
          {navItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            const isBeforeActive = index === activeIndex - 1;
            const isAfterActive = index === activeIndex + 1;
            const Icon = item.icon;
            
            return (
              <div key={item.path} className="flex flex-col">
                {/* Top spacer - show only when THIS item is active */}
                {isActive && index > 0 && <RoundedSpacer position="top" />}
                
                {/* Menu Item */}
                <NavLink
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 h-[52px] pl-6 text-primary-foreground/80 transition-all duration-200",
                    isActive 
                      ? "bg-background text-foreground font-medium rounded-l-2xl" 
                      : "hover:text-primary-foreground"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </NavLink>
                
                {/* Bottom spacer - show only when THIS item is active */}
                {isActive && index < navItems.length - 1 && <RoundedSpacer position="bottom" />}
              </div>
            );
          })}
        </div>
      </nav>

      {/* Logout */}
      <div className="px-4 pb-8">
        <button className="flex items-center gap-3 px-4 py-3 w-full text-primary-foreground/70 hover:text-primary-foreground transition-colors">
          <LogOut className="w-5 h-5" />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
};
