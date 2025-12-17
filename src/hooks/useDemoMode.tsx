import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

const DEMO_EMAIL = 'test@wellora.com';

interface DemoModeContextType {
  isDemoUser: boolean;
  demoUserName: string;
  isLoading: boolean;
}

const DemoModeContext = createContext<DemoModeContextType>({
  isDemoUser: false,
  demoUserName: 'User',
  isLoading: true,
});

export const DemoModeProvider = ({ children }: { children: ReactNode }) => {
  const [isDemoUser, setIsDemoUser] = useState(false);
  const [demoUserName, setDemoUserName] = useState('User');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkDemoUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user?.email === DEMO_EMAIL) {
        setIsDemoUser(true);
        setDemoUserName('Wellora');
      } else if (user) {
        setDemoUserName(user.user_metadata?.name || user.email?.split('@')[0] || 'User');
      }
      setIsLoading(false);
    };

    checkDemoUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      if (session?.user?.email === DEMO_EMAIL) {
        setIsDemoUser(true);
        setDemoUserName('Wellora');
      } else if (session?.user) {
        setIsDemoUser(false);
        setDemoUserName(session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User');
      } else {
        setIsDemoUser(false);
        setDemoUserName('User');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <DemoModeContext.Provider value={{ isDemoUser, demoUserName, isLoading }}>
      {children}
    </DemoModeContext.Provider>
  );
};

export const useDemoMode = () => useContext(DemoModeContext);
