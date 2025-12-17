import { Bell, Moon, Globe, Shield, Palette } from 'lucide-react';
import { useDemoMode } from '@/hooks/useDemoMode';

const SettingsContent = () => {
  const { isDemoUser } = useDemoMode();

  const settings = [
    {
      icon: Bell,
      title: 'Notifications',
      description: 'Manage how you receive reminders and updates',
      enabled: isDemoUser,
    },
    {
      icon: Moon,
      title: 'Dark Mode',
      description: 'Switch between light and dark themes',
      enabled: false,
    },
    {
      icon: Globe,
      title: 'Language',
      description: 'Set your preferred language',
      value: 'English',
    },
    {
      icon: Shield,
      title: 'Privacy',
      description: 'Manage your data and privacy settings',
      enabled: isDemoUser,
    },
  ];

  return (
    <div className="animate-fade-in-up">
      <p className="text-muted-foreground mb-8">Configure your app settings and notifications</p>
      
      <div className="grid grid-cols-2 gap-6">
        {/* Settings List */}
        <div className="wellora-card">
          <h2 className="text-lg font-semibold text-foreground mb-6">App Settings</h2>
          
          <div className="space-y-4">
            {settings.map((setting) => {
              const Icon = setting.icon;
              return (
                <div 
                  key={setting.title}
                  className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{setting.title}</p>
                    <p className="text-sm text-muted-foreground">{setting.description}</p>
                  </div>
                  {setting.value ? (
                    <span className="text-sm text-muted-foreground">{setting.value}</span>
                  ) : (
                    <div 
                      className={`w-12 h-7 rounded-full p-1 transition-colors ${
                        setting.enabled ? 'bg-success' : 'bg-muted'
                      }`}
                    >
                      <div 
                        className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
                          setting.enabled ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Account Settings */}
        <div className="wellora-card">
          <h2 className="text-lg font-semibold text-foreground mb-6">Account</h2>
          
          <div className="space-y-4">
            <div className="p-4 bg-muted/30 rounded-xl">
              <p className="font-medium text-foreground mb-1">Account Type</p>
              <p className="text-sm text-muted-foreground">
                {isDemoUser ? 'Demo Account' : 'Free Account'}
              </p>
            </div>
            
            <div className="p-4 bg-muted/30 rounded-xl">
              <p className="font-medium text-foreground mb-1">Data Export</p>
              <p className="text-sm text-muted-foreground mb-3">Download your wellness data</p>
              <button className="text-sm text-primary font-medium hover:underline">
                Export Data
              </button>
            </div>
            
            <div className="p-4 bg-destructive/10 rounded-xl border border-destructive/20">
              <p className="font-medium text-foreground mb-1">Delete Account</p>
              <p className="text-sm text-muted-foreground mb-3">
                Permanently delete your account and all data
              </p>
              <button className="text-sm text-destructive font-medium hover:underline">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsContent;
