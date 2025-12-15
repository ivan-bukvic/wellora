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
      <nav className="flex-1 pl-3">
        <ul className="flex flex-col">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={cn(
                    'flex items-center gap-4 h-[52px] pl-4 transition-all duration-200',
                    isActive 
                      ? 'bg-white text-primary rounded-tl-[30px] rounded-bl-[30px] rounded-tr-none rounded-br-none' 
                      : 'bg-transparent text-white hover:bg-white/10'
                  )}
                >
                  <Icon className={cn('w-5 h-5', isActive ? 'text-primary' : 'text-white')} />
                  <span className="font-medium">{item.label}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="pl-3 pb-8">
        <button className="flex items-center gap-4 h-[52px] pl-4 w-full text-white/70 hover:text-white transition-colors">
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Log Out</span>
        </button>
      </div>
    </aside>
  );
};
