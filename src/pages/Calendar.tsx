import { MainLayout } from '@/components/layout/MainLayout';

const Calendar = () => {
  return (
    <MainLayout title="Calendar">
      <div className="animate-fade-in-up">
        <p className="text-muted-foreground mb-8">View your wellness schedule and planned activities</p>
        
        <div className="wellora-card">
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            <p>Calendar view coming soon...</p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Calendar;
