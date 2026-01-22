'use client';

import { use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  Pencil,
  Globe,
  GlobeLock,
  ExternalLink,
  FileCode,
  Calendar,
  Cpu,
  Tag,
  CreditCard,
  Play,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { NotebookStatusBadge } from '@/components/notebooks/notebook-status-badge';
import { PublishDialog } from '@/components/notebooks/publish-dialog';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { useNotebook, usePublishNotebook, useUnpublishNotebook } from '@/hooks/use-notebooks';
import { formatDate, formatCredits } from '@/lib/utils/format';
import { useState } from 'react';

interface NotebookDetailPageProps {
  params: Promise<{ id: string }>;
}

const categoryLabels: Record<string, string> = {
  image: 'Image Generation',
  text: 'Text Processing',
  video: 'Video Processing',
  audio: 'Audio Processing',
  other: 'Other',
};

function getCategoryLabel(category: string): string {
  return categoryLabels[category] || category;
}

export default function NotebookDetailPage({ params }: NotebookDetailPageProps) {
  const { id } = use(params);
  const { data: notebook, isLoading, error } = useNotebook(id);
  const publishNotebook = usePublishNotebook();
  const unpublishNotebook = useUnpublishNotebook();
  const [showPublishDialog, setShowPublishDialog] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !notebook) {
    notFound();
  }

  const handlePublish = () => {
    publishNotebook.mutate(notebook.id, {
      onSuccess: () => setShowPublishDialog(false),
    });
  };

  const handleUnpublish = () => {
    unpublishNotebook.mutate(notebook.id);
  };

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/notebooks">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Notebooks
          </Link>
        </Button>
      </div>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{notebook.title}</h1>
            <NotebookStatusBadge status={notebook.status} />
          </div>
          <p className="text-muted-foreground">{notebook.shortDescription}</p>
        </div>
        <div className="flex gap-2">
          {notebook.status === 'draft' ? (
            <Button onClick={() => setShowPublishDialog(true)} disabled={!notebook.hasFile}>
              <Globe className="mr-2 h-4 w-4" />
              Publish
            </Button>
          ) : notebook.status === 'published' ? (
            <Button
              variant="outline"
              onClick={handleUnpublish}
              disabled={unpublishNotebook.isPending}
            >
              <GlobeLock className="mr-2 h-4 w-4" />
              Unpublish
            </Button>
          ) : null}
          <Button variant="outline" asChild>
            <Link href={`/notebooks/${notebook.id}/edit`}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm dark:prose-invert max-w-none">
                {notebook.description.split('\n').map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* File Status */}
          <Card>
            <CardHeader>
              <CardTitle>Notebook File</CardTitle>
              <CardDescription>The .ipynb file that will be executed when users run your notebook</CardDescription>
            </CardHeader>
            <CardContent>
              {notebook.hasFile ? (
                <div className="flex items-center gap-3 rounded-lg bg-green-50 dark:bg-green-950/30 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
                    <FileCode className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="font-medium text-green-700 dark:text-green-300">File uploaded</p>
                    <p className="text-sm text-green-600/80 dark:text-green-400/80">
                      Your notebook is ready for execution
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30">
                    <FileCode className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-amber-700 dark:text-amber-300">No file uploaded</p>
                    <p className="text-sm text-amber-600/80 dark:text-amber-400/80">
                      Upload a .ipynb file to enable publishing
                    </p>
                  </div>
                  <Button size="sm" asChild>
                    <Link href={`/notebooks/${notebook.id}/edit`}>Upload File</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Details Card */}
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <DetailItem icon={Tag} label="Category" value={getCategoryLabel(notebook.category)} />
              <Separator />
              <DetailItem icon={Cpu} label="GPU Type" value={notebook.gpuType} />
              <Separator />
              <DetailItem icon={CreditCard} label="Price" value={formatCredits(notebook.priceCredits)} />
              <Separator />
              <DetailItem icon={Play} label="Total Runs" value={notebook.totalRuns.toLocaleString()} />
              <Separator />
              <DetailItem icon={Calendar} label="Created" value={formatDate(notebook.createdAt)} />
              <Separator />
              <DetailItem icon={Calendar} label="Updated" value={formatDate(notebook.updatedAt)} />
            </CardContent>
          </Card>

          {/* Quick Actions */}
          {notebook.status === 'published' && (
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" asChild>
                  <a
                    href={`https://tarsify.com/notebooks/${notebook.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View on Marketplace
                  </a>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Publish Dialog */}
      <PublishDialog
        open={showPublishDialog}
        onOpenChange={setShowPublishDialog}
        notebook={notebook}
        onPublish={handlePublish}
        isPublishing={publishNotebook.isPending}
      />
    </div>
  );
}

function DetailItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="h-4 w-4" />
        <span className="text-sm">{label}</span>
      </div>
      <span className="font-medium">{value}</span>
    </div>
  );
}
