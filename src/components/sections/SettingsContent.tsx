import { useState, useRef } from 'react';
import { Camera } from 'lucide-react';
import { useDemoMode } from '@/hooks/useDemoMode';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const SettingsContent = () => {
  const { demoUserName } = useDemoMode();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Parse demo user name into first/last
  const nameParts = demoUserName.split(' ');
  const [firstName, setFirstName] = useState(nameParts[0] || '');
  const [lastName, setLastName] = useState(nameParts.slice(1).join(' ') || '');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  
  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

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

    // Create preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setAvatarPreview(event.target?.result as string);
      toast.success('Photo updated');
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = () => {
    toast.success('Profile saved successfully');
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
    <div className="animate-fade-in-up max-w-3xl">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account preferences</p>
      </div>
      
      <div className="space-y-6">
        {/* Profile Photo Card */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-lg font-semibold text-foreground mb-6">Profile Photo</h2>
          
          <div className="flex flex-col items-center sm:items-start gap-4">
            {/* Avatar */}
            <div className="w-28 h-28 rounded-full bg-muted flex items-center justify-center overflow-hidden">
              {avatarPreview ? (
                <img 
                  src={avatarPreview} 
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

        {/* Personal Information Card */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-lg font-semibold text-foreground mb-6">Personal Information</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
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
          
          <div className="space-y-2 mb-6">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value="user@example.com"
              disabled
              className="bg-muted/50 text-muted-foreground cursor-not-allowed"
            />
          </div>
          
          <div className="flex justify-end">
            <Button 
              onClick={handleSaveProfile}
              className="bg-primary hover:bg-primary/90 text-white w-full sm:w-auto"
            >
              Save Changes
            </Button>
          </div>
        </div>

        {/* Security Card */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-lg font-semibold text-foreground mb-6">Change Password</h2>
          
          <div className="space-y-4 mb-6">
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
          
          <div className="flex justify-end">
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
  );
};

export default SettingsContent;
