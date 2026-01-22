import { FileCode, FolderOpen, Search, AlertCircle, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type IconName = 'notebook' | 'folder' | 'search' | 'error';

interface EmptyStateProps {
  icon: IconName | LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

const iconMap: Record<IconName, LucideIcon> = {
  notebook: FileCode,
  folder: FolderOpen,
  search: Search,
  error: AlertCircle,
};

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  const Icon = typeof icon === 'string' ? iconMap[icon] : icon;
  
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center',
        className
      )}
    >
      <Icon className="mb-4 h-12 w-12 text-muted-foreground" />
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      <p className="mb-4 max-w-sm text-sm text-muted-foreground">{description}</p>
      {action}
    </div>
  );
}
