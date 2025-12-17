import { User, Mail, Globe, Bell, Footprints, Moon, StretchHorizontal, Droplets, Brain } from 'lucide-react';
import { useDemoMode } from '@/hooks/useDemoMode';
import { demoProfile } from '@/data/demoData';

const activityPreferences = [
  { icon: Footprints, name: 'Walking', key: 'walking' },
  { icon: Moon, name: 'Sleeping', key: 'sleeping' },
  { icon: StretchHorizontal, name: 'Stretching', key: 'stretching' },
  { icon: Droplets, name: 'Hydration', key: 'hydration' },
  { icon: Brain, name: 'Mindfulness', key: 'mindfulness' },
];

const ProfileContent = () => {
  const { isDemoUser, demoUserName } = useDemoMode();
  
  const profile = isDemoUser ? demoProfile : {
    name: demoUserName,
    email: '',
    preferences: {
      walking: false,
      sleeping: false,
      stretching: false,
      hydration: false,
      mindfulness: false,
    },
    timezone: 'UTC',
    notificationsEnabled: true,
  };

  return (
    <div className="animate-fade-in-up">
      <p className="text-muted-foreground mb-8">Manage your personal information and preferences</p>
      
      <div className="grid grid-cols-2 gap-6">
        {/* Personal Information */}
        <div className="wellora-card">
          <h2 className="text-lg font-semibold text-foreground mb-6">Personal Information</h2>
          
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <User className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Full Name</p>
                <p className="font-medium text-foreground">{profile.name}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium text-foreground">{profile.email || 'Not set'}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <Globe className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Timezone</p>
                <p className="font-medium text-foreground">{profile.timezone}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <Bell className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Notifications</p>
                <p className="font-medium text-foreground">
                  {profile.notificationsEnabled ? 'Enabled' : 'Disabled'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Preferences */}
        <div className="wellora-card">
          <h2 className="text-lg font-semibold text-foreground mb-6">Activity Preferences</h2>
          <p className="text-sm text-muted-foreground mb-4">Activities you're tracking</p>
          
          <div className="space-y-3">
            {activityPreferences.map((activity) => {
              const Icon = activity.icon;
              const isEnabled = profile.preferences[activity.key as keyof typeof profile.preferences];
              
              return (
                <div 
                  key={activity.key}
                  className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                    isEnabled 
                      ? 'bg-success/10 border-success/30' 
                      : 'bg-muted/30 border-border/50'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    isEnabled ? 'bg-success/20' : 'bg-muted'
                  }`}>
                    <Icon className={`w-5 h-5 ${isEnabled ? 'text-success' : 'text-muted-foreground'}`} />
                  </div>
                  <span className="font-medium text-foreground">{activity.name}</span>
                  <div className={`ml-auto w-5 h-5 rounded-full flex items-center justify-center ${
                    isEnabled ? 'bg-success' : 'bg-muted-foreground/30'
                  }`}>
                    {isEnabled && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Empty state hint for non-demo users */}
      {!isDemoUser && (
        <div className="mt-6 text-center">
          <p className="text-muted-foreground text-sm">
            Complete your profile to personalize your wellness journey
          </p>
        </div>
      )}
    </div>
  );
};

export default ProfileContent;
