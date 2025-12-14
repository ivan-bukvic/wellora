import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Activity, 
  Calendar, 
  User, 
  Settings, 
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';
import WelloraLogo from '@/assets/wellora-logo.png';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Activity, label: 'Activities', path: '/activities' },
  { icon: Calendar, label: 'Calendar', path: '/calendar' },
  { icon: User, label: 'Profile', path: '/profile' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export const Sidebar = () => {
  const location = useLocation();
  
  const getActiveIndex = () => {
    return navItems.findIndex(item => item.path === location.pathname);
  };
  
  const activeIndex = getActiveIndex();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-primary flex flex-col z-50">
      {/* Logo */}
      <div className="flex flex-col items-center px-6 pt-8 pb-6 mb-6">
        <img 
          src={WelloraLogo} 
          alt="Wellora logo" 
          className="h-auto object-contain brightness-0 invert mb-3"
          style={{ width: '70px' }}
        />
        <span className="text-3xl font-semibold text-white">Wellora</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1">
        <ul className="flex flex-col">
          {/* Top Helper Nav Item */}
          <li 
            className={cn(
              "h-14 bg-primary pointer-events-none",
              activeIndex === 0 && "rounded-br-[40px]"
            )}
            aria-hidden="true"
          />
          
          {navItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            const isAboveActive = activeIndex !== -1 && index === activeIndex - 1;
            const isBelowActive = activeIndex !== -1 && index === activeIndex + 1;
            const Icon = item.icon;
            
            return (
              <li 
                key={item.path} 
                className={cn(
                  "relative bg-primary",
                  isAboveActive && "rounded-br-[40px]",
                  isBelowActive && "rounded-tr-[40px]"
                )}
              >
                <NavLink
                  to={item.path}
                  className={cn(
                    'flex items-center gap-4 px-6 py-4 transition-all duration-200',
                    isActive 
                      ? 'bg-white text-primary rounded-l-[30px]' 
                      : 'text-white hover:bg-white/10'
                  )}
                >
                  <Icon className={cn('w-5 h-5', isActive ? 'text-primary' : 'text-white')} />
                  <span className="font-medium">{item.label}</span>
                </NavLink>
              </li>
            );
          })}
          
          {/* Bottom Helper Nav Item */}
          <li 
            className={cn(
              "h-14 bg-primary pointer-events-none",
              activeIndex === navItems.length - 1 && "rounded-tr-[40px]"
            )}
            aria-hidden="true"
          />
        </ul>
      </nav>

      {/* Logout */}
      <div className="px-4 pb-8">
        <button className="flex items-center gap-4 px-6 py-4 w-full text-white/70 hover:text-white transition-colors">
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Log Out</span>
        </button>
      </div>
    </aside>
  );
};
