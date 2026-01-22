'use client';

import { Check, X, AlertCircle, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { Notebook } from '@/types/api';
import { cn } from '@/lib/utils';

interface PublishDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  notebook: Notebook;
  onPublish: () => void;
  isPublishing?: boolean;
}

interface RequirementItemProps {
  label: string;
  met: boolean;
  description?: string;
}

function RequirementItem({ label, met, description }: RequirementItemProps) {
  return (
    <div className="flex items-start gap-3">
      <div
        className={cn(
          'flex h-5 w-5 shrink-0 items-center justify-center rounded-full mt-0.5',
          met ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'
        )}
      >
        {met ? (
          <Check className="h-3 w-3 text-green-600 dark:text-green-400" />
        ) : (
          <X className="h-3 w-3 text-red-600 dark:text-red-400" />
        )}
      </div>
      <div>
        <p className={cn('font-medium', !met && 'text-muted-foreground')}>{label}</p>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
    </div>
  );
}

export function PublishDialog({
  open,
  onOpenChange,
  notebook,
  onPublish,
  isPublishing,
}: PublishDialogProps) {
  const requirements = [
    {
      label: 'Notebook file uploaded',
      met: notebook.hasFile,
      description: 'Upload a .ipynb file with your notebook code',
    },
    {
      label: 'Title provided',
      met: notebook.title.length >= 3,
      description: 'At least 3 characters',
    },
    {
      label: 'Short description provided',
      met: notebook.shortDescription.length >= 10,
      description: 'At least 10 characters',
    },
    {
      label: 'Full description provided',
      met: notebook.description.length >= 20,
      description: 'At least 20 characters',
    },
    {
      label: 'Price set',
      met: notebook.priceCredits >= 1,
      description: 'Minimum 1 credit',
    },
  ];

  const allRequirementsMet = requirements.every((r) => r.met);
  const metCount = requirements.filter((r) => r.met).length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Publish Notebook</DialogTitle>
          <DialogDescription>
            Review the requirements below before publishing your notebook to the marketplace.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Progress indicator */}
          <div className="flex items-center gap-2 rounded-lg bg-muted p-3">
            {allRequirementsMet ? (
              <>
                <Check className="h-5 w-5 text-green-600" />
                <span className="font-medium text-green-600">Ready to publish!</span>
              </>
            ) : (
              <>
                <AlertCircle className="h-5 w-5 text-amber-600" />
                <span className="font-medium text-amber-600">
                  {metCount} of {requirements.length} requirements met
                </span>
              </>
            )}
          </div>

          {/* Requirements list */}
          <div className="space-y-3">
            {requirements.map((req, index) => (
              <RequirementItem
                key={index}
                label={req.label}
                met={req.met}
                description={!req.met ? req.description : undefined}
              />
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onPublish} disabled={!allRequirementsMet || isPublishing}>
            {isPublishing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Publish Notebook
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
