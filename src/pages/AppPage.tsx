import { useState, useEffect } from 'react';
import { LayoutDashboard, Activity, Calendar as CalendarIcon, Settings as SettingsIcon, LogOut, Search, X, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useDemoMode } from '@/hooks/useDemoMode';
import { useUserProfile } from '@/context/UserProfileContext';
import { useDashboardSearch } from '@/hooks/useDashboardSearch';
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const activeIndex = navItems.findIndex(item => item.section === activeSection);
  
  // Dashboard search state
  const dashboardSearch = useDashboardSearch();
  const { searchQuery, setSearchQuery, clearSearch, visibleCards, hasNoMatches, isSearching } = dashboardSearch;

  // Clear search when switching sections
  useEffect(() => {
    if (activeSection !== 'dashboard') {
      clearSearch();
    }
  }, [activeSection, clearSearch]);

  // Handle Escape key to clear search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSearching) {
        clearSearch();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearching, clearSearch]);

  // Close sidebar on section change (mobile)
  const handleSectionChange = (section: Section) => {
    setActiveSection(section);
    setSidebarOpen(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardContent visibleCards={visibleCards} hasNoMatches={hasNoMatches} isSearching={isSearching} />;
      case 'activities':
        return <ActivitiesContent />;
      case 'calendar':
        return <CalendarContent />;
      case 'settings':
        return <SettingsContent />;
      default:
        return <DashboardContent visibleCards={visibleCards} hasNoMatches={hasNoMatches} isSearching={isSearching} />;
    }
  };

  // Get initials from user name
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const displayName = profile?.name || demoUserName;

  return (
    <div className="h-[100dvh] bg-background overflow-hidden flex">
      {/* Mobile Sidebar Overlay */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300",
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside className={cn(
        "fixed lg:relative z-50 h-full bg-primary flex flex-col shrink-0 transition-transform duration-300 ease-out",
        "w-64 lg:w-64",
        sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
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
                  <button 
                    onClick={() => handleSectionChange(item.section)} 
                    className={cn(
                      'flex items-center gap-4 py-4 pl-6 w-full text-left min-h-[48px]', 
                      isActive ? 'bg-background text-primary rounded-l-[40px]' : 'bg-primary text-white', 
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
            <li className={cn("h-14 pointer-events-none", activeIndex === navItems.length - 1 ? "bg-background" : "bg-primary")} aria-hidden="true">
              <div className={cn("h-full w-full bg-primary", activeIndex === navItems.length - 1 && "rounded-tr-[40px]")} />
            </li>
          </ul>
        </nav>

        {/* Logout */}
        <div className="pl-[30px] pb-8">
          <button onClick={handleLogout} className="flex items-center gap-4 py-4 pl-6 w-full text-white/70 hover:text-white transition-colors min-h-[48px]">
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium">Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 h-full flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4 lg:py-[22px] shrink-0 gap-4">
          {/* Left side - Mobile menu + Title */}
          <div className="flex items-center gap-3 min-w-0">
            {/* Mobile Menu Button */}
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 text-foreground hover:text-primary transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
            
            <div className="min-w-0">
              <h1 className="text-xl lg:text-2xl font-semibold text-foreground truncate">{sectionTitles[activeSection]}</h1>
              {sectionSubtitles[activeSection] && (
                <p className="text-muted-foreground mt-1 text-sm hidden sm:block">{sectionSubtitles[activeSection]}</p>
              )}
            </div>
          </div>
          
          {/* Right side - Search, User */}
          <div className="flex items-center gap-3 sm:gap-4 lg:gap-6 flex-shrink-0">
            {/* Search - only functional on dashboard */}
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 lg:left-4 top-1/2 -translate-y-1/2 w-4 lg:w-5 h-4 lg:h-5 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                disabled={activeSection !== 'dashboard'}
                className={cn(
                  "w-48 md:w-64 lg:w-96 pl-9 lg:pl-12 py-2.5 lg:py-3 bg-card rounded-[40px] border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all",
                  searchQuery ? "pr-9 lg:pr-10" : "pr-3 lg:pr-4",
                  activeSection !== 'dashboard' && "opacity-50 cursor-not-allowed"
                )}
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 lg:right-4 top-1/2 -translate-y-1/2 w-4 lg:w-5 h-4 lg:h-5 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Clear search"
                >
                  <X className="w-4 lg:w-5 h-4 lg:h-5" />
                </button>
              )}
            </div>
            
            {/* User Avatar */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-9 h-9 lg:w-10 lg:h-10 bg-accent rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xs lg:text-sm font-medium text-accent-foreground">{getInitials(displayName)}</span>
                )}
              </div>
              <span className="text-sm font-medium text-foreground hidden md:block">{displayName}</span>
            </div>
          </div>
        </header>

        {/* Mobile Search - shown below header on mobile when on dashboard */}
        {activeSection === 'dashboard' && (
          <div className="sm:hidden px-4 pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search dashboard..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={cn(
                  "w-full pl-9 py-2.5 bg-card rounded-[40px] border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all",
                  searchQuery ? "pr-9" : "pr-3"
                )}
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}
        
        {/* Section Content */}
        <div className="flex-1 min-h-0 overflow-y-auto px-4 sm:px-6 lg:px-8 pb-6 lg:pb-[30px]">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default AppPage;