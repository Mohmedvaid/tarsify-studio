'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { notFound } from 'next/navigation';
import { ArrowLeft, Trash2, Globe, GlobeLock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { NotebookForm } from '@/components/notebooks/notebook-form';
import { FileUpload } from '@/components/notebooks/file-upload';
import { PublishDialog } from '@/components/notebooks/publish-dialog';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { NotebookStatusBadge } from '@/components/notebooks/notebook-status-badge';
import {
  useNotebook,
  useUpdateNotebook,
  useDeleteNotebook,
  useUploadNotebookFile,
  useDeleteNotebookFile,
  usePublishNotebook,
  useUnpublishNotebook,
} from '@/hooks/use-notebooks';
import type { CreateNotebookFormData } from '@/lib/utils/validation';

interface NotebookEditPageProps {
  params: Promise<{ id: string }>;
}

export default function NotebookEditPage({ params }: NotebookEditPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { data: notebook, isLoading, error } = useNotebook(id);

  const updateNotebook = useUpdateNotebook();
  const deleteNotebook = useDeleteNotebook();
  const uploadFile = useUploadNotebookFile();
  const deleteFile = useDeleteNotebookFile();
  const publishNotebook = usePublishNotebook();
  const unpublishNotebook = useUnpublishNotebook();

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
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

  const handleSubmit = async (data: CreateNotebookFormData) => {
    await updateNotebook.mutateAsync({
      id: notebook.id,
      data: {
        title: data.title,
        shortDescription: data.shortDescription,
        description: data.description,
        category: data.category,
        gpuType: data.gpuType,
        priceCredits: data.priceCredits,
      },
    });
  };

  const handleFileUpload = async (file: File) => {
    await uploadFile.mutateAsync({ id: notebook.id, file });
  };

  const handleFileDelete = async () => {
    await deleteFile.mutateAsync(notebook.id);
  };

  const handleDelete = () => {
    deleteNotebook.mutate(notebook.id, {
      onSuccess: () => router.push('/notebooks'),
    });
  };

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
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/notebooks/${notebook.id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Notebook
          </Link>
        </Button>
        <NotebookStatusBadge status={notebook.status} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Edit Form */}
          <Card>
            <CardHeader>
              <CardTitle>Edit Notebook</CardTitle>
              <CardDescription>Update your notebook details and settings</CardDescription>
            </CardHeader>
            <CardContent>
              <NotebookForm
                notebook={notebook}
                onSubmit={handleSubmit}
                isSubmitting={updateNotebook.isPending}
              />
            </CardContent>
          </Card>

          {/* File Upload */}
          <Card>
            <CardHeader>
              <CardTitle>Notebook File</CardTitle>
              <CardDescription>
                Upload your Jupyter notebook file (.ipynb). This is required before publishing.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FileUpload
                hasFile={notebook.hasFile}
                onUpload={handleFileUpload}
                onDelete={handleFileDelete}
                isUploading={uploadFile.isPending}
                isDeleting={deleteFile.isPending}
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Publish Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Publishing</CardTitle>
              <CardDescription>
                {notebook.status === 'draft'
                  ? 'Publish your notebook to make it available on the marketplace'
                  : notebook.status === 'published'
                  ? 'Your notebook is live on the marketplace'
                  : 'This notebook is archived'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {notebook.status === 'draft' && (
                <Button
                  className="w-full"
                  onClick={() => setShowPublishDialog(true)}
                  disabled={!notebook.hasFile}
                >
                  <Globe className="mr-2 h-4 w-4" />
                  Publish Notebook
                </Button>
              )}
              {notebook.status === 'published' && (
                <>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleUnpublish}
                    disabled={unpublishNotebook.isPending}
                  >
                    <GlobeLock className="mr-2 h-4 w-4" />
                    Unpublish
                  </Button>
                  <Button variant="outline" className="w-full" asChild>
                    <a
                      href={`https://tarsify.com/notebooks/${notebook.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View on Marketplace
                    </a>
                  </Button>
                </>
              )}
              {!notebook.hasFile && notebook.status === 'draft' && (
                <p className="text-sm text-muted-foreground text-center">
                  Upload a notebook file to enable publishing
                </p>
              )}
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription>
                Permanently delete this notebook. This action cannot be undone.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="destructive"
                className="w-full"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Notebook
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dialogs */}
      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Delete Notebook"
        description={`Are you sure you want to delete "${notebook.title}"? This action cannot be undone and all associated data will be permanently removed.`}
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleDelete}
        isLoading={deleteNotebook.isPending}
      />

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
