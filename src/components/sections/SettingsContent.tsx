import { useState, useRef, useEffect } from 'react';
import { Camera } from 'lucide-react';
import { useDemoMode } from '@/hooks/useDemoMode';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface SettingsContentProps {
  avatarUrl: string | null;
  onAvatarChange: (url: string | null) => void;
}

const SettingsContent = ({ avatarUrl, onAvatarChange }: SettingsContentProps) => {
  const { demoUserName } = useDemoMode();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // User data from auth
  const [userEmail, setUserEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  
  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Fetch user data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Email always comes from auth
        setUserEmail(user.email || '');
        
        // Check for first_name/last_name in metadata first (saved from Settings)
        const metadata = user.user_metadata || {};
        
        if (metadata.first_name !== undefined || metadata.last_name !== undefined) {
          // User has previously saved first/last name
          setFirstName(metadata.first_name || '');
          setLastName(metadata.last_name || '');
        } else if (metadata.name) {
          // Only full_name exists (from signup) - prefill first name, leave last empty
          setFirstName(metadata.name);
          setLastName('');
        }
      }
    };

    fetchUserData();
  }, []);

  // Get initials from user name
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    // Create preview and update parent
    const reader = new FileReader();
    reader.onload = (event) => {
      const url = event.target?.result as string;
      onAvatarChange(url);
      toast.success('Photo updated');
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async () => {
    try {
      // Save first_name and last_name to user metadata
      const { error } = await supabase.auth.updateUser({
        data: {
          first_name: firstName.trim(),
          last_name: lastName.trim(),
        }
      });

      if (error) throw error;
      toast.success('Profile saved successfully');
    } catch (error) {
      toast.error('Failed to save profile');
    }
  };

  const handleUpdatePassword = () => {
    setPasswordError('');
    
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('All password fields are required');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }
    
    if (newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return;
    }

    toast.success('Password updated successfully');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="animate-fade-in-up">
      <div className="space-y-6">
        {/* Profile Photo Card - Full width */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-lg font-semibold text-foreground mb-6">Profile Photo</h2>
          
          <div className="flex flex-col items-center sm:items-start gap-4">
            {/* Avatar */}
            <div className="w-28 h-28 rounded-full bg-muted flex items-center justify-center overflow-hidden">
              {avatarUrl ? (
                <img 
                  src={avatarUrl} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-2xl font-semibold text-muted-foreground">
                  {getInitials(demoUserName)}
                </span>
              )}
            </div>
            
            {/* Upload Button */}
            <div className="flex flex-col items-center sm:items-start gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                onChange={handleFileChange}
                className="hidden"
              />
              <Button 
                onClick={handlePhotoClick}
                className="bg-primary hover:bg-primary/90 text-white"
              >
                <Camera className="w-4 h-4 mr-2" />
                Change photo
              </Button>
              <p className="text-sm text-muted-foreground">PNG or JPG · Max 5MB</p>
            </div>
          </div>
        </div>

        {/* Two-column grid for Personal Info + Change Password */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Information Card */}
          <div className="bg-card border border-border rounded-xl p-6 h-full flex flex-col">
            <h2 className="text-lg font-semibold text-foreground mb-6">Personal Information</h2>
            
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Enter first name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Enter last name"
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">You can optionally split your name into first and last name.</p>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={userEmail}
                  disabled
                  className="bg-muted/50 text-muted-foreground cursor-not-allowed"
                />
              </div>
            </div>
            
            <div className="flex justify-end mt-6">
              <Button 
                onClick={handleSaveProfile}
                className="bg-primary hover:bg-primary/90 text-white w-full sm:w-auto"
              >
                Save Changes
              </Button>
            </div>
          </div>

          {/* Security Card */}
          <div className="bg-card border border-border rounded-xl p-6 h-full flex flex-col">
            <h2 className="text-lg font-semibold text-foreground mb-6">Change Password</h2>
            
            <div className="flex-1 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                />
              </div>
              
              {passwordError && (
                <p className="text-sm text-destructive">{passwordError}</p>
              )}
            </div>
            
            <div className="flex justify-end mt-6">
              <Button 
                onClick={handleUpdatePassword}
                className="bg-primary hover:bg-primary/90 text-white w-full sm:w-auto"
              >
                Update Password
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsContent;
