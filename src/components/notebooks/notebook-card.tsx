import Link from 'next/link';
import Image from 'next/image';
import { FileCode } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { NotebookStatusBadge } from './notebook-status-badge';
import type { Notebook } from '@/types/api';
import { formatDate, formatCredits } from '@/lib/utils/format';
import { cn } from '@/lib/utils';

interface NotebookCardProps {
  notebook: Notebook;
}

const categoryColors: Record<string, string> = {
  image: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  text: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  video: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  audio: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  other: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
};

const gpuColors: Record<string, string> = {
  T4: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  L4: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  A100: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  H100: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
};

export function NotebookCard({ notebook }: NotebookCardProps) {
  return (
    <Link href={`/notebooks/${notebook.id}`} className="block">
      <Card className="overflow-hidden transition-all hover:shadow-md cursor-pointer">
        {/* Thumbnail */}
        <div className="relative aspect-video bg-muted">
          {notebook.thumbnailUrl ? (
            <Image
              src={notebook.thumbnailUrl}
              alt={notebook.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <FileCode className="h-12 w-12 text-muted-foreground/40" />
            </div>
          )}
          {/* Status badge overlay */}
          <div className="absolute top-2 left-2">
            <NotebookStatusBadge status={notebook.status} />
          </div>
        </div>

        <CardContent className="p-4">
          {/* Title */}
          <h3 className="font-semibold line-clamp-1">{notebook.title}</h3>
          {/* Description */}
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
            {notebook.shortDescription}
          </p>
          {/* Tags */}
          <div className="mt-3 flex flex-wrap gap-2">
            <span
              className={cn(
                'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium',
                categoryColors[notebook.category]
              )}
            >
              {notebook.category}
            </span>
            <span
              className={cn(
                'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium',
                gpuColors[notebook.gpuType]
              )}
            >
              {notebook.gpuType}
            </span>
          </div>
        </CardContent>

        <CardFooter className="flex items-center justify-between border-t px-4 py-3">
          <span className="text-sm font-medium">{formatCredits(notebook.priceCredits)}</span>
          <span className="text-xs text-muted-foreground">
            {formatDate(notebook.updatedAt)}
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
}
