import { Award, Flame, Moon, Droplets, TrendingUp, TrendingDown } from 'lucide-react';

const achievements = [
  {
    icon: Moon,
    label: 'Sleep',
    oldValue: '6hrs',
    newValue: '7.5hrs',
    change: '+25%',
    positive: true,
    color: 'bg-accent',
  },
  {
    icon: Droplets,
    label: 'Hydration',
    oldValue: '1.5L',
    newValue: '2.2L',
    change: '+47%',
    positive: true,
    color: 'bg-primary',
  },
  {
    icon: Flame,
    label: 'Calories',
    oldValue: '2200',
    newValue: '1850',
    change: '-16%',
    positive: true,
    color: 'bg-warning',
  },
];

export const AchievementsCard = () => {
  return (
    <div className="wellora-card animate-fade-in-up stagger-2">
      <div className="flex items-center gap-2 mb-5">
        <Award className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Achievements Achieved</h3>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {achievements.map((achievement) => {
          const Icon = achievement.icon;
          const TrendIcon = achievement.positive ? TrendingUp : TrendingDown;
          
          return (
            <div key={achievement.label} className="achievement-badge">
              <div className={`w-10 h-10 ${achievement.color} rounded-xl flex items-center justify-center`}>
                <Icon className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{achievement.label}</p>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-muted-foreground">{achievement.oldValue}</span>
                  <span className="text-xs text-muted-foreground">→</span>
                  <span className="text-xs font-medium text-foreground">{achievement.newValue}</span>
                </div>
              </div>
              <div className={`flex items-center gap-1 text-xs font-medium ${
                achievement.positive ? 'text-success' : 'text-destructive'
              }`}>
                <TrendIcon className="w-3 h-3" />
                <span>{achievement.change}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
