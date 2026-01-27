'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MoreHorizontal, Pencil, Trash2, Eye, Globe, GlobeLock, FileCode } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { NotebookStatusBadge } from './notebook-status-badge';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import type { Notebook } from '@/types/api';
import { formatDate, formatCredits } from '@/lib/utils/format';
import { cn } from '@/lib/utils';

interface NotebookCardProps {
  notebook: Notebook;
  onDelete?: (id: string) => void;
  onPublish?: (id: string) => void;
  onUnpublish?: (id: string) => void;
  isDeleting?: boolean;
  isPublishing?: boolean;
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

export function NotebookCard({
  notebook,
  onDelete,
  onPublish,
  onUnpublish,
  isDeleting,
  isPublishing,
}: NotebookCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDelete = () => {
    onDelete?.(notebook.id);
    setShowDeleteDialog(false);
  };

  return (
    <>
      <Card className="group overflow-hidden transition-all hover:shadow-md">
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
          {/* Action menu */}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/notebooks/${notebook.id}`}>
                    <Eye className="mr-2 h-4 w-4" />
                    View
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/notebooks/${notebook.id}/edit`}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {notebook.status === 'draft' ? (
                  <DropdownMenuItem
                    onClick={() => onPublish?.(notebook.id)}
                    disabled={isPublishing || !notebook.notebookFileUrl}
                  >
                    <Globe className="mr-2 h-4 w-4" />
                    Publish
                  </DropdownMenuItem>
                ) : notebook.status === 'published' ? (
                  <DropdownMenuItem
                    onClick={() => onUnpublish?.(notebook.id)}
                    disabled={isPublishing}
                  >
                    <GlobeLock className="mr-2 h-4 w-4" />
                    Unpublish
                  </DropdownMenuItem>
                ) : null}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <CardContent className="p-4">
          {/* Title */}
          <Link
            href={`/notebooks/${notebook.id}`}
            className="font-semibold hover:underline line-clamp-1"
          >
            {notebook.title}
          </Link>
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

      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Delete Notebook"
        description={`Are you sure you want to delete "${notebook.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />
    </>
  );
}
