import { useState } from 'react';
import { LayoutDashboard, Activity, Calendar as CalendarIcon, Settings as SettingsIcon, LogOut, Bell, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useDemoMode } from '@/hooks/useDemoMode';
import { useUserProfile } from '@/context/UserProfileContext';
import WelloraLogo from '@/assets/wellora-logo.png';

// Import section content components
import DashboardContent from '@/components/sections/DashboardContent';
import ActivitiesContent from '@/components/sections/ActivitiesContent';
import CalendarContent from '@/components/sections/CalendarContent';
import SettingsContent from '@/components/sections/SettingsContent';

type Section = 'dashboard' | 'activities' | 'calendar' | 'settings';

const navItems: {
  icon: typeof LayoutDashboard;
  label: string;
  section: Section;
}[] = [{
  icon: LayoutDashboard,
  label: 'Dashboard',
  section: 'dashboard'
}, {
  icon: Activity,
  label: 'Activities',
  section: 'activities'
}, {
  icon: CalendarIcon,
  label: 'Calendar',
  section: 'calendar'
}, {
  icon: SettingsIcon,
  label: 'Settings',
  section: 'settings'
}];

const sectionTitles: Record<Section, string> = {
  dashboard: 'Dashboard',
  activities: 'Activities',
  calendar: 'Calendar',
  settings: 'Settings'
};

const sectionSubtitles: Record<Section, string> = {
  dashboard: '',
  activities: '',
  calendar: '',
  settings: 'Manage your account preferences'
};

const AppPage = () => {
  const navigate = useNavigate();
  const { demoUserName } = useDemoMode();
  const { profile } = useUserProfile();
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

  const displayName = profile?.name || demoUserName;

  return (
    <div className="h-[100dvh] bg-background overflow-hidden flex">
      {/* Sidebar */}
      <aside className="w-64 h-full bg-primary flex flex-col shrink-0 relative z-50">
        {/* Logo */}
        <div className="flex flex-col items-center px-6 pt-8 pb-6 mb-6">
          <img src={WelloraLogo} alt="Wellora logo" className="h-auto object-contain brightness-0 invert mb-3" style={{
            width: '70px'
          }} />
          <span className="text-3xl font-semibold text-white">Wellora</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1">
          <ul className="flex flex-col pl-[30px]">
            {/* Top Helper Nav Item */}
            <li className={cn("h-14 pointer-events-none", activeIndex === 0 ? "bg-background" : "bg-primary")} aria-hidden="true">
              <div className={cn("h-full w-full bg-primary", activeIndex === 0 && "rounded-br-[40px]")} />
            </li>
            
            {navItems.map((item, index) => {
              const isActive = activeSection === item.section;
              const isAboveActive = activeIndex !== -1 && index === activeIndex - 1;
              const isBelowActive = activeIndex !== -1 && index === activeIndex + 1;
              const Icon = item.icon;
              return (
                <li key={item.section} className={cn("relative", isAboveActive || isBelowActive ? "bg-background" : "bg-primary")}>
                  <button onClick={() => setActiveSection(item.section)} className={cn('flex items-center gap-4 py-4 pl-6 w-full text-left', isActive ? 'bg-background text-primary rounded-l-[40px]' : 'bg-primary text-white', isAboveActive && "rounded-br-[40px]", isBelowActive && "rounded-tr-[40px]")}>
                    <Icon className={cn('w-5 h-5 flex-shrink-0', isActive ? 'text-primary' : 'text-white')} />
                    <span className="font-medium">{item.label}</span>
                  </button>
                </li>
              );
            })}
            
            {/* Bottom Helper Nav Item */}
            <li className={cn("h-14 pointer-events-none", activeIndex === navItems.length - 1 ? "bg-background" : "bg-primary")} aria-hidden="true">
              <div className={cn("h-full w-full bg-primary", activeIndex === navItems.length - 1 && "rounded-tr-[40px]")} />
            </li>
          </ul>
        </nav>

        {/* Logout */}
        <div className="pl-[30px] pb-8">
          <button onClick={handleLogout} className="flex items-center gap-4 py-4 pl-6 w-full text-white/70 hover:text-white transition-colors">
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium">Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 h-full flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between px-8 py-[22px] shrink-0">
          {/* Left side - Title & Subtitle */}
          <div>
            <h1 className="text-2xl font-semibold text-foreground">{sectionTitles[activeSection]}</h1>
            {sectionSubtitles[activeSection] && (
              <p className="text-muted-foreground mt-1">{sectionSubtitles[activeSection]}</p>
            )}
          </div>
          
          {/* Right side - Search, Notifications, User */}
          <div className="flex items-center gap-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input type="text" placeholder="Search" className="w-96 pl-12 pr-4 py-3 bg-card rounded-[40px] border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all" />
            </div>
            
            {/* Notifications */}
            <button className="relative p-3 bg-card rounded-full border border-border/50 hover:bg-muted transition-colors">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full"></span>
            </button>
            
            {/* User Avatar */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center overflow-hidden">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-sm font-medium text-accent-foreground">{getInitials(displayName)}</span>
                )}
              </div>
              <span className="text-sm font-medium text-foreground">{displayName}</span>
            </div>
          </div>
        </header>
        
        {/* Section Content */}
        <div className="flex-1 min-h-0 overflow-y-auto px-8 pb-[30px]">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default AppPage;
