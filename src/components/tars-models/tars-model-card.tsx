import Link from 'next/link';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TarsModelStatusBadge } from './tars-model-status-badge';
import { Image, Music, FileText, Video, FileCode } from 'lucide-react';
import type { TarsModel, BaseModelCategory } from '@/types/api';
import { cn } from '@/lib/utils';

interface TarsModelCardProps {
  model: TarsModel;
}

const categoryIcons: Record<BaseModelCategory, React.ElementType> = {
  IMAGE: Image,
  AUDIO: Music,
  TEXT: FileText,
  VIDEO: Video,
  DOCUMENT: FileCode,
};

const categoryColors: Record<BaseModelCategory, string> = {
  IMAGE: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  AUDIO: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  TEXT: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  VIDEO: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  DOCUMENT: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
};

export function TarsModelCard({ model }: TarsModelCardProps) {
  const category = model.baseModel?.category ?? 'TEXT';
  const CategoryIcon = categoryIcons[category];

  return (
    <Link href={`/models/${model.id}`} className="block">
      <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
        {/* Header with icon and status */}
        <div className="relative p-4 pb-0">
          <div className="flex items-start justify-between">
            <div className={cn('p-3 rounded-lg', categoryColors[category])}>
              <CategoryIcon className="h-6 w-6" />
            </div>
            <TarsModelStatusBadge status={model.status} />
          </div>
        </div>

        <CardContent className="pt-4">
          {/* Title */}
          <h3 className="font-semibold text-lg line-clamp-1">{model.title}</h3>

          {/* Base model info */}
          <p className="text-sm text-muted-foreground mt-1">
            Based on: {model.baseModel?.name ?? 'Unknown'}
          </p>

          {/* Description */}
          {model.description && (
            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
              {model.description}
            </p>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-3">
            <Badge variant="outline" className="text-xs">
              {model.baseModel?.outputType ?? 'Unknown'}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {model.priceCredits ?? 0} credits
            </Badge>
          </div>
        </CardContent>

        <CardFooter className="border-t pt-3 text-sm text-muted-foreground">
          <div className="flex items-center justify-between w-full">
            <span>{model.totalRuns ?? 0} runs</span>
            <span>
              {new Date(model.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
