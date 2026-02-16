import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { TarsModelStatus } from '@/types/api';

interface TarsModelStatusBadgeProps {
  status: TarsModelStatus;
  className?: string;
}

const statusConfig: Record<TarsModelStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  DRAFT: { label: 'Draft', variant: 'secondary' },
  PUBLISHED: { label: 'Published', variant: 'default' },
  ARCHIVED: { label: 'Archived', variant: 'outline' },
};

export function TarsModelStatusBadge({ status, className }: TarsModelStatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <Badge variant={config.variant} className={cn(className)}>
      {config.label}
    </Badge>
  );
}
