'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Search, LayoutGrid, List, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NotebookCard } from '@/components/notebooks/notebook-card';
import { PageHeader } from '@/components/shared/page-header';
import { EmptyState } from '@/components/shared/empty-state';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import {
  useNotebooks,
  useDeleteNotebook,
  usePublishNotebook,
  useUnpublishNotebook,
} from '@/hooks/use-notebooks';
import type { NotebookStatus } from '@/types/api';

type ViewMode = 'grid' | 'list';

export default function NotebooksPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<NotebookStatus | 'all'>('all');
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useNotebooks({
    page,
    limit: 12,
    status: statusFilter === 'all' ? undefined : statusFilter,
  });

  const deleteNotebook = useDeleteNotebook();
  const publishNotebook = usePublishNotebook();
  const unpublishNotebook = useUnpublishNotebook();

  // Filter notebooks by search query (client-side)
  const filteredNotebooks =
    data?.data.filter(
      (notebook) =>
        notebook.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        notebook.shortDescription.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  const handleDelete = (id: string) => {
    deleteNotebook.mutate(id);
  };

  const handlePublish = (id: string) => {
    publishNotebook.mutate(id);
  };

  const handleUnpublish = (id: string) => {
    unpublishNotebook.mutate(id);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notebooks"
        description="Manage your AI notebooks and publish them to the marketplace"
        action={
          <Button asChild>
            <Link href="/notebooks/new">
              <Plus className="mr-2 h-4 w-4" />
              New Notebook
            </Link>
          </Button>
        }
      />

      {/* Filters and Search */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search notebooks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Status Filter */}
          <Select
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value as NotebookStatus | 'all')}
          >
            <SelectTrigger className="w-[150px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* View Toggle */}
        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)}>
          <TabsList>
            <TabsTrigger value="grid">
              <LayoutGrid className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="list">
              <List className="h-4 w-4" />
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : error ? (
        <div className="text-center py-12 text-destructive">
          Failed to load notebooks. Please try again.
        </div>
      ) : filteredNotebooks.length === 0 ? (
        <EmptyState
          icon="notebook"
          title={searchQuery || statusFilter !== 'all' ? 'No notebooks found' : 'No notebooks yet'}
          description={
            searchQuery || statusFilter !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Create your first AI notebook to get started'
          }
          action={
            !searchQuery && statusFilter === 'all' ? (
              <Button asChild>
                <Link href="/notebooks/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Notebook
                </Link>
              </Button>
            ) : undefined
          }
        />
      ) : (
        <>
          {/* Grid View */}
          {viewMode === 'grid' && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredNotebooks.map((notebook) => (
                <NotebookCard
                  key={notebook.id}
                  notebook={notebook}
                  onDelete={handleDelete}
                  onPublish={handlePublish}
                  onUnpublish={handleUnpublish}
                  isDeleting={deleteNotebook.isPending}
                  isPublishing={publishNotebook.isPending || unpublishNotebook.isPending}
                />
              ))}
            </div>
          )}

          {/* List View */}
          {viewMode === 'list' && (
            <div className="space-y-4">
              {filteredNotebooks.map((notebook) => (
                <NotebookCard
                  key={notebook.id}
                  notebook={notebook}
                  onDelete={handleDelete}
                  onPublish={handlePublish}
                  onUnpublish={handleUnpublish}
                  isDeleting={deleteNotebook.isPending}
                  isPublishing={publishNotebook.isPending || unpublishNotebook.isPending}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {data?.pagination && data.pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {page} of {data.pagination.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(data.pagination.totalPages, p + 1))}
                disabled={page === data.pagination.totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
