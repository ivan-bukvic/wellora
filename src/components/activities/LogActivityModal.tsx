import React from "react";
import { Footprints, Moon, Droplets, Brain } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import YogaMoonIcon from "@/components/icons/YogaMoonIcon";

interface LogActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void | Promise<void>;
  onChange: (name: string, value: string) => void;
  values: Record<string, string>;
  activityName: string | null;
}

const activityConfigs: Record<
  string,
  {
    icon: React.ComponentType<{
      className?: string;
    }>;
    fields: {
      name: string;
      label: string;
      type: "number" | "text" | "textarea";
      placeholder: string;
      unit?: string;
    }[];
  }
> = {
  Walking: {
    icon: Footprints,
    fields: [
      {
        name: "duration",
        label: "Duration",
        type: "number",
        placeholder: "30",
        unit: "minutes",
      },
      {
        name: "steps",
        label: "Steps (optional)",
        type: "number",
        placeholder: "4000",
      },
      {
        name: "notes",
        label: "Notes (optional)",
        type: "textarea",
        placeholder: "How did your walk feel today?",
      },
    ],
  },
  Sleeping: {
    icon: Moon,
    fields: [
      {
        name: "duration",
        label: "Sleep Duration",
        type: "number",
        placeholder: "8",
        unit: "hours",
      },
      {
        name: "quality",
        label: "Sleep Quality (1-10)",
        type: "number",
        placeholder: "7",
      },
      {
        name: "notes",
        label: "Notes (optional)",
        type: "textarea",
        placeholder: "Any dreams or disruptions?",
      },
    ],
  },
  Stretching: {
    icon: YogaMoonIcon,
    fields: [
      {
        name: "duration",
        label: "Duration",
        type: "number",
        placeholder: "15",
        unit: "minutes",
      },
      {
        name: "notes",
        label: "Notes (optional)",
        type: "textarea",
        placeholder: "What stretches did you do?",
      },
    ],
  },
  Hydration: {
    icon: Droplets,
    fields: [
      {
        name: "amount",
        label: "Water Intake",
        type: "number",
        placeholder: "8",
        unit: "glasses",
      },
      {
        name: "notes",
        label: "Notes (optional)",
        type: "textarea",
        placeholder: "Any hydration goals for tomorrow?",
      },
    ],
  },
  Mindfulness: {
    icon: Brain,
    fields: [
      {
        name: "duration",
        label: "Duration",
        type: "number",
        placeholder: "10",
        unit: "minutes",
      },
      {
        name: "type",
        label: "Practice Type",
        type: "text",
        placeholder: "Meditation, breathing, journaling...",
      },
      {
        name: "notes",
        label: "Notes (optional)",
        type: "textarea",
        placeholder: "How do you feel after your practice?",
      },
    ],
  },
};

const LogActivityModal = ({ isOpen, onClose, onSave, onChange, values, activityName }: LogActivityModalProps) => {
  console.log("[LogActivityModal render]", activityName, values);

  if (!activityName) return null;

  const config = activityConfigs[activityName];
  if (!config) return null;

  const Icon = config.icon;
  const instanceId = React.useId();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave();
  };

  const handleOpenChange = (open: boolean) => {
    // Only react to close; ignore open=true to avoid accidental close loops.
    if (!open) onClose();
  };

  return (
    <Dialog open={isOpen} modal>
      <DialogContent
        className="sm:max-w-[440px] bg-card border-0 shadow-2xl rounded-3xl p-0 gap-0"
        style={{
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.2), 0 12px 24px -8px rgba(0, 0, 0, 0.15)",
        }}
      >
        {/* Wellora Icon - Top Right */}

        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle className="text-xl font-semibold text-foreground">Log Activity</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
            <Icon className="w-4 h-4" />
            {activityName}
          </DialogDescription>
        </DialogHeader>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 pb-6" autoComplete="off">
          <div className="space-y-4">
            {config.fields.map((field) => {
              const fieldId = `${instanceId}-${field.name}`;

              return (
                <div key={field.name} className="space-y-2">
                  <Label htmlFor={fieldId} className="text-sm font-medium text-foreground">
                    {field.label}
                  </Label>

                  {field.type === "textarea" ? (
                    <Textarea
                      id={fieldId}
                      name={fieldId}
                      placeholder={field.placeholder}
                      value={values[field.name] ?? ""}
                      onChange={(e) => onChange(field.name, e.target.value)}
                      autoComplete="off"
                      className="bg-white border-border/50 focus:border-primary focus:ring-primary/20 rounded-xl resize-none min-h-[80px]"
                    />
                  ) : (
                    <div className="relative">
                      <Input
                        id={fieldId}
                        name={fieldId}
                        type={field.type}
                        placeholder={field.placeholder}
                        value={values[field.name] ?? ""}
                        onChange={(e) => onChange(field.name, e.target.value)}
                        autoComplete="off"
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
              );
            })}
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
              onClick={onClose}
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
