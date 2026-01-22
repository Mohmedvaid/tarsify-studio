'use client';

import { Badge } from '@/components/ui/badge';
import type { NotebookStatus } from '@/types/api';
import { cn } from '@/lib/utils';

interface NotebookStatusBadgeProps {
  status: NotebookStatus;
  className?: string;
}

const statusConfig: Record<NotebookStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  draft: {
    label: 'Draft',
    variant: 'secondary',
  },
  published: {
    label: 'Published',
    variant: 'default',
  },
  archived: {
    label: 'Archived',
    variant: 'outline',
  },
};

export function NotebookStatusBadge({ status, className }: NotebookStatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <Badge variant={config.variant} className={cn(className)}>
      {config.label}
    </Badge>
  );
}
