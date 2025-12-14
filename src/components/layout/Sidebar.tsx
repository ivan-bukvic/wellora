import { useState } from 'react';
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
          className="w-9 h-auto object-contain brightness-0 invert mb-3"
        />
        <span className="text-2xl font-semibold text-white">Wellora</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <li key={item.path} className="relative">
                <NavLink
                  to={item.path}
                  className={cn(
                    'nav-item',
                    isActive ? 'active bg-white text-[#7FC8F8]' : 'text-white'
                  )}
                >
                  <Icon className={cn('w-5 h-5', isActive ? 'text-[#7FC8F8]' : 'text-white')} />
                  <span>{item.label}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="px-4 pb-8">
        <button className="nav-item w-full text-white/70 hover:text-white">
          <LogOut className="w-5 h-5 text-white" />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
};
