import { useState } from 'react';
import { 
  LayoutDashboard, 
  Activity, 
  Calendar as CalendarIcon, 
  User, 
  Settings as SettingsIcon, 
  LogOut,
  Bell,
  Search
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useDemoMode } from '@/hooks/useDemoMode';
import WelloraLogo from '@/assets/wellora-logo.png';

// Import section content components
import DashboardContent from '@/components/sections/DashboardContent';
import ActivitiesContent from '@/components/sections/ActivitiesContent';
import CalendarContent from '@/components/sections/CalendarContent';
import ProfileContent from '@/components/sections/ProfileContent';
import SettingsContent from '@/components/sections/SettingsContent';

type Section = 'dashboard' | 'activities' | 'calendar' | 'profile' | 'settings';

const navItems: { icon: typeof LayoutDashboard; label: string; section: Section }[] = [
  { icon: LayoutDashboard, label: 'Dashboard', section: 'dashboard' },
  { icon: Activity, label: 'Activities', section: 'activities' },
  { icon: CalendarIcon, label: 'Calendar', section: 'calendar' },
  { icon: User, label: 'Profile', section: 'profile' },
  { icon: SettingsIcon, label: 'Settings', section: 'settings' },
];

const sectionTitles: Record<Section, string> = {
  dashboard: 'Dashboard',
  activities: 'Activities',
  calendar: 'Calendar',
  profile: 'Profile',
  settings: 'Settings',
};

const AppPage = () => {
  const navigate = useNavigate();
  const { demoUserName } = useDemoMode();
  const [activeSection, setActiveSection] = useState<Section>('dashboard');

  const activeIndex = navItems.findIndex(item => item.section === activeSection);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardContent />;
      case 'activities':
        return <ActivitiesContent />;
      case 'calendar':
        return <CalendarContent />;
      case 'profile':
        return <ProfileContent />;
      case 'settings':
        return <SettingsContent />;
      default:
        return <DashboardContent />;
    }
  };

  // Get initials from user name
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
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
          <ul className="flex flex-col pl-[30px]">
            {/* Top Helper Nav Item */}
            <li 
              className={cn(
                "h-14 pointer-events-none",
                activeIndex === 0 ? "bg-background" : "bg-primary"
              )}
              aria-hidden="true"
            >
              <div className={cn(
                "h-full w-full bg-primary",
                activeIndex === 0 && "rounded-br-[40px]"
              )} />
            </li>
            
            {navItems.map((item, index) => {
              const isActive = activeSection === item.section;
              const isAboveActive = activeIndex !== -1 && index === activeIndex - 1;
              const isBelowActive = activeIndex !== -1 && index === activeIndex + 1;
              const Icon = item.icon;
              
              return (
                <li 
                  key={item.section} 
                  className={cn(
                    "relative",
                    (isAboveActive || isBelowActive) ? "bg-background" : "bg-primary"
                  )}
                >
                  <button
                    onClick={() => setActiveSection(item.section)}
                    className={cn(
                      'flex items-center gap-4 py-4 pl-6 w-full text-left',
                      isActive 
                        ? 'bg-background text-primary rounded-l-[40px]'
                        : 'bg-primary text-white',
                      isAboveActive && "rounded-br-[40px]",
                      isBelowActive && "rounded-tr-[40px]"
                    )}
                  >
                    <Icon className={cn('w-5 h-5 flex-shrink-0', isActive ? 'text-primary' : 'text-white')} />
                    <span className="font-medium">{item.label}</span>
                  </button>
                </li>
              );
            })}
            
            {/* Bottom Helper Nav Item */}
            <li 
              className={cn(
                "h-14 pointer-events-none",
                activeIndex === navItems.length - 1 ? "bg-background" : "bg-primary"
              )}
              aria-hidden="true"
            >
              <div className={cn(
                "h-full w-full bg-primary",
                activeIndex === navItems.length - 1 && "rounded-tr-[40px]"
              )} />
            </li>
          </ul>
        </nav>

        {/* Logout */}
        <div className="pl-[30px] pb-8">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-4 py-4 pl-6 w-full text-white/70 hover:text-white transition-colors"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium">Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 min-h-screen">
        {/* Header */}
        <header className="flex items-center justify-between px-8 py-6">
          <h1 className="text-2xl font-semibold text-foreground">{sectionTitles[activeSection]}</h1>
          
          <div className="flex items-center gap-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search"
                className="w-96 pl-12 pr-4 py-3 bg-card rounded-[40px] border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
              />
            </div>
            
            {/* Notifications */}
            <button className="relative p-3 bg-card rounded-full border border-border/50 hover:bg-muted transition-colors">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full"></span>
            </button>
            
            {/* User */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-accent-foreground">{getInitials(demoUserName)}</span>
              </div>
              <span className="text-sm font-medium text-foreground">{demoUserName}</span>
            </div>
          </div>
        </header>
        
        {/* Section Content */}
        <div className="px-8 pb-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default AppPage;
