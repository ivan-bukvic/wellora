import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Bell, Search } from 'lucide-react';

interface MainLayoutProps {
  children: ReactNode;
  title: string;
}

export const MainLayout = ({ children, title }: MainLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      
      {/* Main Content */}
      <main className="ml-64 min-h-screen">
        {/* Header */}
        <header className="flex items-center justify-between px-8 py-6">
          <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
          
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
                <span className="text-sm font-medium text-accent-foreground">JD</span>
              </div>
              <span className="text-sm font-medium text-foreground">Jane Doe</span>
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        <div className="px-8 pb-8">
          {children}
        </div>
      </main>
    </div>
  );
};
