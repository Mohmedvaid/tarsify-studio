'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Globe, GlobeLock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileUpload } from '@/components/notebooks/file-upload';
import { PublishDialog } from '@/components/notebooks/publish-dialog';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { NotebookStatusBadge } from '@/components/notebooks/notebook-status-badge';
import {
  useNotebook,
  useUploadNotebookFile,
  useDeleteNotebookFile,
  usePublishNotebook,
  useUnpublishNotebook,
} from '@/hooks/use-notebooks';

interface NotebookEditPageProps {
  params: Promise<{ id: string }>;
}

export default function NotebookEditPage({ params }: NotebookEditPageProps) {
  const { id } = use(params);
  const { data: notebook, isLoading, error } = useNotebook(id);

  const uploadFile = useUploadNotebookFile();
  const deleteFile = useDeleteNotebookFile();
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

  const handleFileUpload = async (file: File) => {
    await uploadFile.mutateAsync({ id: notebook.id, file });
  };

  const handleFileDelete = async () => {
    await deleteFile.mutateAsync(notebook.id);
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
          {/* Notebook Details (Read-only) */}
          <Card>
            <CardHeader>
              <CardTitle>Notebook Details</CardTitle>
              <CardDescription>
                Notebook metadata cannot be edited after creation. To make changes, create a new notebook.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Title</label>
                <p className="mt-1">{notebook.title}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Short Description</label>
                <p className="mt-1">{notebook.shortDescription || <span className="italic text-muted-foreground">Not provided</span>}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Description</label>
                <p className="mt-1 whitespace-pre-wrap">{notebook.description || <span className="italic text-muted-foreground">Not provided</span>}</p>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Category</label>
                  <p className="mt-1 capitalize">{notebook.category}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">GPU Type</label>
                  <p className="mt-1">{notebook.gpuType}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Price</label>
                  <p className="mt-1">{notebook.priceCredits} credits</p>
                </div>
              </div>
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
                hasFile={!!notebook.notebookFileUrl}
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
                  disabled={!notebook.notebookFileUrl}
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
              {!notebook.notebookFileUrl && notebook.status === 'draft' && (
                <p className="text-sm text-muted-foreground text-center">
                  Upload a notebook file to enable publishing
                </p>
              )}
            </CardContent>
          </Card>

        </div>
      </div>

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
