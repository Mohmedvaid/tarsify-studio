'use client';

import { use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Edit, Trash2, Globe, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/shared';
import { TarsModelStatusBadge } from '@/components/tars-models';
import { LoadingSpinner } from '@/components/shared';
import { ErrorMessage } from '@/components/shared';
import { ConfirmDialog } from '@/components/shared';
import { useTarsModel, useDeleteTarsModel, usePublishTarsModel } from '@/hooks';
import { useState } from 'react';

interface ModelDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function ModelDetailPage({ params }: ModelDetailPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showPublishDialog, setShowPublishDialog] = useState(false);

  const { data: model, isLoading, error } = useTarsModel(id);
  const deleteModel = useDeleteTarsModel();
  const publishModel = usePublishTarsModel();

  const handleDelete = async () => {
    try {
      await deleteModel.mutateAsync(id);
      router.push('/models');
    } catch {
      // Error handled by mutation
    }
  };

  const handlePublish = async () => {
    try {
      await publishModel.mutateAsync({ id, action: 'publish' });
      setShowPublishDialog(false);
    } catch {
      // Error handled by mutation
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !model) {
    return (
      <ErrorMessage
        title="Model not found"
        message="We couldn't find this model. It may have been deleted."
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/models">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <PageHeader
            title={model.title}
            description={model.description || 'No description'}
          />
        </div>
        <TarsModelStatusBadge status={model.status} />
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button asChild variant="outline">
          <Link href={`/models/${id}/edit`}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Link>
        </Button>

        {model.status === 'DRAFT' && (
          <Button onClick={() => setShowPublishDialog(true)}>
            <Globe className="mr-2 h-4 w-4" />
            Publish
          </Button>
        )}

        <Button
          variant="destructive"
          onClick={() => setShowDeleteDialog(true)}
          disabled={model.status === 'PUBLISHED'}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </div>

      {/* Model Info */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Model Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Slug</span>
              <span className="font-mono">{model.slug}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Price</span>
              <span>{model.priceCredits ?? 0} credits</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Runs</span>
              <span>{(model.totalRuns ?? 0).toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Base Model</CardTitle>
            <CardDescription>{model.baseModel?.name ?? 'Unknown'}</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <Settings className="inline mr-2 h-4 w-4" />
            Configuration based on platform base model
          </CardContent>
        </Card>
      </div>

      {/* Timestamps */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Timeline</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Created</span>
            <span>{new Date(model.createdAt).toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Last Updated</span>
            <span>{new Date(model.updatedAt).toLocaleString()}</span>
          </div>
          {model.publishedAt && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Published</span>
              <span>{new Date(model.publishedAt).toLocaleString()}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Delete Model"
        description={`Are you sure you want to delete "${model.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        isLoading={deleteModel.isPending}
        variant="destructive"
      />

      {/* Publish Confirmation */}
      <ConfirmDialog
        open={showPublishDialog}
        onOpenChange={setShowPublishDialog}
        title="Publish Model"
        description={`Publishing "${model.title}" will make it available in the marketplace. Users will be charged ${model.priceCredits} credits per run.`}
        confirmLabel="Publish"
        onConfirm={handlePublish}
        isLoading={publishModel.isPending}
      />
    </div>
  );
}
