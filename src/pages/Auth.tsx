import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import authBackground from '@/assets/auth-background.jpg';
import WelloraLogo from '@/assets/wellora-logo.png';

const Auth = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement signup logic with Supabase
    console.log('Sign up:', { fullName, email, password });
  };

  return (
    <div 
      className="min-h-screen w-full flex items-center justify-start pl-[15%]"
      style={{
        backgroundImage: `url(${authBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Glassmorphism Card */}
      <div 
        className="w-[460px] p-10 rounded-[40px]"
        style={{
          background: 'rgba(255, 255, 255, 0.28)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          boxShadow: 'inset 0 1px 12px rgba(255, 255, 255, 0.35), 0 8px 30px -6px rgba(0, 0, 0, 0.08)',
          border: '1px solid rgba(255, 255, 255, 0.25)',
          transform: 'translate(200px, -100px)',
        }}
      >
        {/* Logo Header - Centered */}
        <div className="flex justify-center mb-10">
          <img 
            src={WelloraLogo} 
            alt="Wellora logo" 
            className="h-auto object-contain brightness-0 invert"
            style={{ width: '80px' }}
          />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-semibold text-white text-center mb-10">
          Sign Up
        </h1>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Full Name */}
          <div className="relative">
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Full Name"
              className="w-full bg-transparent border-0 border-b py-3 px-0 focus:outline-none transition-colors placeholder-white"
              style={{ 
                borderColor: 'rgba(255, 255, 255, 0.6)',
                color: '#ffffff',
              }}
            />
          </div>

          {/* Email Address */}
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              className="w-full bg-transparent border-0 border-b py-3 px-0 focus:outline-none transition-colors placeholder-white"
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
              className="w-full bg-transparent border-0 border-b py-3 px-0 pr-10 focus:outline-none transition-colors placeholder-white"
              style={{ 
                borderColor: 'rgba(255, 255, 255, 0.6)',
                color: '#ffffff',
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-0 top-1/2 -translate-y-1/2 hover:opacity-80 transition-opacity"
              style={{ color: 'rgba(255, 255, 255, 0.7)' }}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-white text-primary font-semibold py-4 rounded-full hover:bg-white/90 transition-colors mt-4"
          >
            Sign Up
          </button>
        </form>

        {/* Footer */}
        <p className="text-center mt-8 text-sm" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
          Already have an account?{' '}
          <Link to="/auth" className="text-white underline underline-offset-2 hover:opacity-80 transition-opacity font-medium">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Auth;
