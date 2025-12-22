import { useState } from 'react';
import { Footprints, Moon, Droplets, Brain } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import YogaMoonIcon from '@/components/icons/YogaMoonIcon';
import welloraLogo from '@/assets/wellora-logo.svg';
interface LogActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  activityName: string | null;
}

const activityConfigs: Record<string, { 
  icon: React.ComponentType<{ className?: string }>;
  fields: { name: string; label: string; type: 'number' | 'text' | 'textarea'; placeholder: string; unit?: string }[];
}> = {
  Walking: {
    icon: Footprints,
    fields: [
      { name: 'duration', label: 'Duration', type: 'number', placeholder: '30', unit: 'minutes' },
      { name: 'steps', label: 'Steps (optional)', type: 'number', placeholder: '4000' },
      { name: 'notes', label: 'Notes (optional)', type: 'textarea', placeholder: 'How did your walk feel today?' },
    ],
  },
  Sleeping: {
    icon: Moon,
    fields: [
      { name: 'duration', label: 'Sleep Duration', type: 'number', placeholder: '8', unit: 'hours' },
      { name: 'quality', label: 'Sleep Quality (1-10)', type: 'number', placeholder: '7' },
      { name: 'notes', label: 'Notes (optional)', type: 'textarea', placeholder: 'Any dreams or disruptions?' },
    ],
  },
  Stretching: {
    icon: YogaMoonIcon,
    fields: [
      { name: 'duration', label: 'Duration', type: 'number', placeholder: '15', unit: 'minutes' },
      { name: 'notes', label: 'Notes (optional)', type: 'textarea', placeholder: 'What stretches did you do?' },
    ],
  },
  Hydration: {
    icon: Droplets,
    fields: [
      { name: 'amount', label: 'Water Intake', type: 'number', placeholder: '8', unit: 'glasses' },
      { name: 'notes', label: 'Notes (optional)', type: 'textarea', placeholder: 'Any hydration goals for tomorrow?' },
    ],
  },
  Mindfulness: {
    icon: Brain,
    fields: [
      { name: 'duration', label: 'Duration', type: 'number', placeholder: '10', unit: 'minutes' },
      { name: 'type', label: 'Practice Type', type: 'text', placeholder: 'Meditation, breathing, journaling...' },
      { name: 'notes', label: 'Notes (optional)', type: 'textarea', placeholder: 'How do you feel after your practice?' },
    ],
  },
};

const LogActivityModal = ({ isOpen, onClose, activityName }: LogActivityModalProps) => {
  const [formData, setFormData] = useState<Record<string, string>>({});

  if (!activityName) return null;

  const config = activityConfigs[activityName];
  if (!config) return null;

  const Icon = config.icon;

  const handleInputChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would save the activity data
    console.log('Saving activity:', activityName, formData);
    setFormData({});
    onClose();
  };

  const handleClose = () => {
    setFormData({});
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent 
        className="sm:max-w-[440px] bg-card border-0 shadow-2xl rounded-3xl p-0 gap-0"
        style={{ 
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.2), 0 12px 24px -8px rgba(0, 0, 0, 0.15)',
        }}
      >
        {/* Wellora Icon - Top Right */}
        <img 
          src={welloraLogo} 
          alt="" 
          className="absolute top-5 right-5 w-6 h-6 opacity-60"
          style={{ filter: 'hue-rotate(0deg)' }}
        />
        
        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle className="text-xl font-semibold text-foreground">
            Log Activity
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
            <Icon className="w-4 h-4" />
            {activityName}
          </DialogDescription>
        </DialogHeader>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 pb-6">
          <div className="space-y-4">
            {config.fields.map((field) => (
              <div key={field.name} className="space-y-2">
                <Label 
                  htmlFor={field.name} 
                  className="text-sm font-medium text-foreground"
                >
                  {field.label}
                </Label>
                
                {field.type === 'textarea' ? (
                  <Textarea
                    id={field.name}
                    placeholder={field.placeholder}
                    value={formData[field.name] || ''}
                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                    className="bg-white border-border/50 focus:border-primary focus:ring-primary/20 rounded-xl resize-none min-h-[80px]"
                  />
                ) : (
                  <div className="relative">
                    <Input
                      id={field.name}
                      type={field.type}
                      placeholder={field.placeholder}
                      value={formData[field.name] || ''}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                      className="bg-white border-border/50 focus:border-primary focus:ring-primary/20 rounded-xl pr-16"
                    />
                    {field.unit && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                        {field.unit}
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 mt-6">
            <Button 
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-white font-medium rounded-xl h-11"
            >
              Save Activity
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="w-full border border-border/50 bg-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30 hover:border-border font-medium rounded-xl h-11"
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LogActivityModal;
