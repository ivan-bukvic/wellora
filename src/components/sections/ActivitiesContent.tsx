import { Footprints, Moon, StretchHorizontal, Droplets, Brain, Plus } from 'lucide-react';

const activities = [
  { icon: Footprints, name: 'Walking', description: 'Track your daily steps', color: 'bg-primary' },
  { icon: Moon, name: 'Sleeping', description: 'Monitor your sleep quality', color: 'bg-secondary' },
  { icon: StretchHorizontal, name: 'Stretching', description: 'Keep your body flexible', color: 'bg-accent' },
  { icon: Droplets, name: 'Hydration', description: 'Stay hydrated throughout the day', color: 'bg-primary' },
  { icon: Brain, name: 'Mindfulness', description: 'Practice mental wellness', color: 'bg-warning' },
];

const ActivitiesContent = () => {
  return (
    <div className="animate-fade-in-up">
      <p className="text-muted-foreground mb-8">Track and log your daily wellness activities</p>
      
      <div className="grid grid-cols-3 gap-6">
        {activities.map((activity) => {
          const Icon = activity.icon;
          return (
            <div key={activity.name} className="wellora-card hover:shadow-soft-lg cursor-pointer transition-all">
              <div className={`w-14 h-14 ${activity.color} rounded-2xl flex items-center justify-center mb-4`}>
                <Icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{activity.name}</h3>
              <p className="text-sm text-muted-foreground">{activity.description}</p>
              
              <button className="mt-4 flex items-center gap-2 text-primary text-sm font-medium hover:underline">
                <Plus className="w-4 h-4" />
                Log Activity
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ActivitiesContent;
