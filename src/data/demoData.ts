// Demo data for portfolio user: test@wellora.com
// This data is only used for demonstration purposes

// Generate dates for the past N days
const getPastDate = (daysAgo: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split('T')[0];
};

// AI Insights - rotate through these
export const demoAIInsights = [
  {
    title: "You're most consistent with walking during weekdays",
    description: "Your morning walks are becoming a solid habit. Consider adding a short evening walk on weekends to boost your streak."
  },
  {
    title: "Your sleep improved this week — nice balance",
    description: "Averaging 7.5 hours this week, up from 6.8 hours last week. Your mindfulness sessions before bed seem to help."
  },
  {
    title: "Short mindfulness sessions are working well",
    description: "Your 10-minute sessions are more consistent than the 20-minute ones. Quality over quantity is paying off."
  },
  {
    title: "Hydration is your hidden strength",
    description: "You've hit your water goal 5 out of 7 days this week. That's helping your energy levels stay stable."
  },
  {
    title: "You've been very consistent this week",
    description: "Great balance between activity and rest. Your mindfulness sessions have improved your sleep quality by 15%."
  },
];

// Get a random insight based on current session
export const getRandomInsight = () => {
  const index = Math.floor(Date.now() / 3600000) % demoAIInsights.length; // Changes every hour
  return demoAIInsights[index];
};

// Dashboard stats
export const demoDashboardStats = {
  totalActivityThisMonth: {
    value: 56,
    change: '+7.0',
    positive: true,
  },
  totalActivityThisWeek: {
    value: 19,
    change: '+2.8',
    positive: true,
  },
};

// Duration chart data - realistic with some variation
export const demoDurationData = [
  { day: 'Mon', hours: 1.8 },
  { day: 'Tue', hours: 2.2 },
  { day: 'Wed', hours: 1.5 },
  { day: 'Thu', hours: 2.5 },
  { day: 'Fri', hours: 1.2 },
];

// Activity frequency - realistic percentages
export const demoActivityFrequency = {
  totalPercent: 73,
  activities: [
    { name: 'Walking', percent: 45 },
    { name: 'Mindfulness', percent: 28 },
    { name: 'Stretching', percent: 27 },
  ],
};

// Progress chart data - natural trend, not perfect
export const demoProgressData = [
  { month: 'Jan', value: 4 },
  { month: 'Feb', value: 6 },
  { month: 'Mar', value: 5 },
  { month: 'Apr', value: 8 },
  { month: 'May', value: 7 },
  { month: 'Jun', value: 10 },
  { month: 'Jul', value: 9 },
];

// Achievements
export const demoAchievements = [
  { label: 'Sleep', oldValue: '6hrs', newValue: '7.5hrs', change: '+25%', positive: true },
  { label: 'Hydration', oldValue: '1.5L', newValue: '2.2L', change: '+47%', positive: true },
  { label: 'Calories', oldValue: '2200', newValue: '1850', change: '-16%', positive: true },
];

// Monthly goals - not all completed
export const demoMonthlyGoals = [
  { label: 'Sleep', current: 47, target: 240, unit: 'hrs' },
  { label: 'Drink Water', current: 108, target: 180, unit: 'L' },
  { label: 'Mindfulness', current: 7, target: 10, unit: 'hrs' },
  { label: 'Daily Steps', current: 5600, target: 10000, unit: '/Day' },
];

// Today's routine for demo user
export const demoTodayRoutine = [
  { name: 'Walking', completed: true, duration: '30 min' },
  { name: 'Sleeping', completed: true, duration: '7.5 hrs' },
  { name: 'Stretching', completed: true, duration: '15 min' },
  { name: 'Hydration', completed: false, progress: '6/8 glasses' },
  { name: 'Mindfulness', completed: true, duration: '10 min' },
];

// Activity logs for past 21 days - realistic with gaps and streaks
export const generateDemoActivityLogs = () => {
  const logs: Array<{
    date: string;
    activities: Array<{
      name: string;
      completed: boolean;
      duration?: string;
      notes?: string;
    }>;
  }> = [];

  const activityTypes = ['Walking', 'Sleeping', 'Stretching', 'Hydration', 'Mindfulness'];
  
  for (let i = 0; i < 30; i++) {
    const date = getPastDate(i);
    const isWeekend = new Date(date).getDay() === 0 || new Date(date).getDay() === 6;
    
    // Simulate realistic completion patterns
    const dayActivities = activityTypes.map(activity => {
      let completed = false;
      let duration = '';
      
      switch (activity) {
        case 'Walking':
          // Higher completion on weekdays
          completed = isWeekend ? Math.random() > 0.4 : Math.random() > 0.2;
          duration = completed ? `${Math.floor(20 + Math.random() * 25)} min` : '';
          break;
        case 'Sleeping':
          // Almost always tracked
          completed = Math.random() > 0.1;
          duration = completed ? `${(6.5 + Math.random() * 2).toFixed(1)} hrs` : '';
          break;
        case 'Stretching':
          // 60% completion rate
          completed = Math.random() > 0.4;
          duration = completed ? `${Math.floor(10 + Math.random() * 15)} min` : '';
          break;
        case 'Hydration':
          // Varies day to day
          completed = Math.random() > 0.35;
          duration = completed ? '8/8 glasses' : `${Math.floor(4 + Math.random() * 3)}/8 glasses`;
          break;
        case 'Mindfulness':
          // Lower completion but improving
          completed = i < 7 ? Math.random() > 0.3 : Math.random() > 0.5;
          duration = completed ? `${Math.floor(8 + Math.random() * 12)} min` : '';
          break;
      }
      
      return { name: activity, completed, duration };
    });
    
    logs.push({ date, activities: dayActivities });
  }
  
  return logs;
};

// Calendar data - shows which days have activities
export const generateDemoCalendarData = () => {
  const calendarData: Record<string, { 
    completed: number; 
    total: number; 
    hasStreak: boolean;
  }> = {};
  
  const logs = generateDemoActivityLogs();
  
  logs.forEach((log, index) => {
    const completedCount = log.activities.filter(a => a.completed).length;
    const prevDay = logs[index + 1];
    const prevCompleted = prevDay ? prevDay.activities.filter(a => a.completed).length : 0;
    
    calendarData[log.date] = {
      completed: completedCount,
      total: 5,
      hasStreak: completedCount >= 3 && prevCompleted >= 3,
    };
  });
  
  return calendarData;
};

// Profile data for demo user
export const demoProfile = {
  name: 'Wellora',
  email: 'test@wellora.com',
  preferences: {
    walking: true,
    sleeping: true,
    stretching: true,
    hydration: true,
    mindfulness: true,
  },
  timezone: 'UTC',
  notificationsEnabled: true,
};
