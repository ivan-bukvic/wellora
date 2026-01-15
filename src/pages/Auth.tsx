import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import authBackground from '@/assets/auth-background.jpg';
import WelloraLogo from '@/assets/wellora-logo.png';

type AuthMode = 'signup' | 'login';

const Auth = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get('mode') === 'login' ? 'login' : 'signup';
  const [authMode, setAuthMode] = useState<AuthMode>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (authMode === 'signup' && !fullName.trim()) {
      toast.error('Please enter your full name');
      return;
    }
    if (!email.trim()) {
      toast.error('Please enter your email address');
      return;
    }
    if (!password.trim()) {
      toast.error('Please enter a password');
      return;
    }

    setIsLoading(true);

    try {
      if (authMode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/app`,
            data: {
              name: fullName.trim(),
            },
          },
        });

        if (error) {
          toast.error('Signup failed', {
            description: error.message || 'Please check your details and try again',
          });
          return;
        }

        toast.success('Welcome to Wellora', {
          description: 'Your account has been created',
        });
        navigate('/app');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) {
          toast.error('Login failed', {
            description: error.message || 'Please check your credentials and try again',
          });
          return;
        }

        toast.success('Welcome back!', {
          description: 'You have been logged in',
        });
        navigate('/app');
      }
    } catch (err) {
      toast.error(authMode === 'signup' ? 'Signup failed' : 'Login failed', {
        description: 'Please check your details and try again',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setAuthMode(authMode === 'signup' ? 'login' : 'signup');
    setFullName('');
    setEmail('');
    setPassword('');
  };

  return (
    <div 
      className="min-h-screen w-full flex items-center justify-center px-4 sm:px-6 lg:justify-start lg:pl-[15%]"
      style={{
        backgroundImage: `url(${authBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Glassmorphism Card */}
      <div 
        className="w-full max-w-[460px] p-6 sm:p-8 lg:p-10 rounded-[24px] sm:rounded-[32px] lg:rounded-[40px] lg:translate-x-[100px] lg:-translate-y-[50px]"
        style={{
          background: 'rgba(255, 255, 255, 0.18)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          boxShadow: 'inset 0 1px 12px rgba(255, 255, 255, 0.35), 0 8px 30px -6px rgba(0, 0, 0, 0.08)',
          border: '1px solid rgba(255, 255, 255, 0.25)',
        }}
      >
        {/* Logo Header - Centered */}
        <div className="flex justify-center mb-8 lg:mb-10">
          <img 
            src={WelloraLogo} 
            alt="Wellora logo" 
            className="h-auto object-contain brightness-0 invert"
            style={{ width: '100px' }}
          />
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-semibold text-white text-center mb-8 lg:mb-10 -mt-[10px] lg:-mt-[15px]">
          {authMode === 'signup' ? 'Sign Up' : 'Log In'}
        </h1>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8" autoComplete="off">
          {/* Full Name - Only for signup */}
          {authMode === 'signup' && (
            <div className="relative">
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Full Name"
                autoComplete="off"
                name="fullName_noautofill"
                className="w-full bg-transparent border-0 border-b py-3 px-0 focus:outline-none transition-colors placeholder-white text-base"
                style={{ 
                  borderColor: 'rgba(255, 255, 255, 0.6)',
                  color: '#ffffff',
                }}
              />
            </div>
          )}

          {/* Email Address */}
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              autoComplete="off"
              name="email_noautofill"
              className="w-full bg-transparent border-0 border-b py-3 px-0 focus:outline-none transition-colors placeholder-white text-base"
              style={{ 
                borderColor: 'rgba(255, 255, 255, 0.6)',
                color: '#ffffff',
              }}
            />
          </div>

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              autoComplete="new-password"
              name="password_noautofill"
              className="w-full bg-transparent border-0 border-b py-3 px-0 pr-10 focus:outline-none transition-colors placeholder-white text-base"
              style={{ 
                borderColor: 'rgba(255, 255, 255, 0.6)',
                color: '#ffffff',
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-0 top-1/2 -translate-y-1/2 hover:opacity-80 transition-opacity p-2"
              style={{ color: 'rgba(255, 255, 255, 0.7)' }}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-white text-primary font-semibold py-3.5 sm:py-4 rounded-full hover:bg-white/90 transition-colors mt-4 disabled:opacity-50 disabled:cursor-not-allowed text-base min-h-[48px]"
          >
            {isLoading 
              ? (authMode === 'signup' ? 'Creating account...' : 'Logging in...') 
              : (authMode === 'signup' ? 'Sign Up' : 'Log In')
            }
          </button>
        </form>

        {/* Footer */}
        <p className="text-center mt-6 sm:mt-8 text-sm" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
          {authMode === 'signup' ? (
            <>
              Already have an account?{' '}
              <button 
                onClick={toggleAuthMode}
                className="text-white underline underline-offset-2 hover:opacity-80 transition-opacity font-medium p-1"
              >
                Login here
              </button>
            </>
          ) : (
            <>
              Don't have an account?{' '}
              <button 
                onClick={toggleAuthMode}
                className="text-white underline underline-offset-2 hover:opacity-80 transition-opacity font-medium p-1"
              >
                Sign up
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default Auth;