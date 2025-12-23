import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';

interface UserProfile {
  id: string;
  name: string | null;
  email: string | null;
  avatar_url: string | null;
  timezone: string | null;
}

interface UserProfileContextType {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  authLoading: boolean;
  profileLoading: boolean;
  refreshProfile: () => Promise<void>;
  updateProfileLocal: (partial: Partial<UserProfile>) => void;
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

export const UserProfileProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);

  // Fetch profile from database
  const fetchProfile = useCallback(async (userId: string, userEmail?: string | null) => {
    setProfileLoading(true);
    try {
      // Try to get existing profile
      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (fetchError) {
        console.error('Error fetching profile:', fetchError);
        setProfileLoading(false);
        return;
      }

      if (existingProfile) {
        setProfile({
          id: existingProfile.id,
          name: existingProfile.name,
          email: existingProfile.email,
          avatar_url: existingProfile.avatar_url,
          timezone: existingProfile.timezone,
        });
      } else {
        // Profile doesn't exist - create it
        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert({ id: userId, email: userEmail })
          .select()
          .single();

        if (insertError) {
          console.error('Error creating profile:', insertError);
        } else if (newProfile) {
          setProfile({
            id: newProfile.id,
            name: newProfile.name,
            email: newProfile.email,
            avatar_url: newProfile.avatar_url,
            timezone: newProfile.timezone,
          });
        }
      }
    } catch (error) {
      console.error('Profile fetch error:', error);
    } finally {
      setProfileLoading(false);
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (session?.user?.id) {
      await fetchProfile(session.user.id, session.user.email);
    }
  }, [session, fetchProfile]);

  const updateProfileLocal = useCallback((partial: Partial<UserProfile>) => {
    setProfile(prev => prev ? { ...prev, ...partial } : null);
  }, []);

  // Initialize auth and subscribe to changes
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      setSession(initialSession);
      setAuthLoading(false);
    });

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      if (!newSession) {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch profile when session changes
  useEffect(() => {
    if (session?.user?.id) {
      fetchProfile(session.user.id, session.user.email);
    } else {
      setProfile(null);
    }
  }, [session?.user?.id, fetchProfile]);

  return (
    <UserProfileContext.Provider
      value={{
        session,
        user: session?.user ?? null,
        profile,
        authLoading,
        profileLoading,
        refreshProfile,
        updateProfileLocal,
      }}
    >
      {children}
    </UserProfileContext.Provider>
  );
};

export const useUserProfile = () => {
  const context = useContext(UserProfileContext);
  if (context === undefined) {
    throw new Error('useUserProfile must be used within a UserProfileProvider');
  }
  return context;
};
