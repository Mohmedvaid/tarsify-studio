'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileCode, X, Loader2, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  hasFile?: boolean;  // true if notebookFileUrl is not null
  onUpload: (file: File) => Promise<void>;
  onDelete?: () => Promise<void>;
  isUploading?: boolean;
  isDeleting?: boolean;
  className?: string;
}

export function FileUpload({
  hasFile,
  onUpload,
  onDelete,
  isUploading,
  isDeleting,
  className,
}: FileUploadProps) {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      // Validate file type
      if (!file.name.endsWith('.ipynb')) {
        setError('Only .ipynb files are allowed');
        return;
      }

      // Validate file size (max 50MB)
      if (file.size > 50 * 1024 * 1024) {
        setError('File size must be less than 50MB');
        return;
      }

      setError(null);
      setUploadProgress(0);

      // Simulate progress (since we don't have real upload progress from fetch)
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      try {
        await onUpload(file);
        setUploadProgress(100);
      } catch {
        setError('Failed to upload file. Please try again.');
      } finally {
        clearInterval(progressInterval);
        setTimeout(() => setUploadProgress(0), 1000);
      }
    },
    [onUpload]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'application/x-ipynb+json': ['.ipynb'],
    },
    maxFiles: 1,
    disabled: isUploading || isDeleting,
  });

  if (hasFile) {
    return (
      <div className={cn('rounded-lg border bg-muted/50 p-6', className)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
              <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="font-medium">Notebook file uploaded</p>
              <p className="text-sm text-muted-foreground">
                Your .ipynb file is ready for execution
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => document.getElementById('file-replace')?.click()}
              disabled={isUploading}
            >
              {isUploading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Upload className="mr-2 h-4 w-4" />
              )}
              Replace
            </Button>
            {onDelete && (
              <Button
                variant="outline"
                size="sm"
                onClick={onDelete}
                disabled={isDeleting}
                className="text-destructive hover:text-destructive"
              >
                {isDeleting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <X className="mr-2 h-4 w-4" />
                )}
                Remove
              </Button>
            )}
          </div>
        </div>
        <input
          id="file-replace"
          type="file"
          accept=".ipynb"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onDrop([file]);
          }}
        />
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div
        {...getRootProps()}
        className={cn(
          'relative cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors',
          isDragActive && !isDragReject && 'border-primary bg-primary/5',
          isDragReject && 'border-destructive bg-destructive/5',
          !isDragActive && 'hover:border-primary/50 hover:bg-muted/50',
          (isUploading || isDeleting) && 'pointer-events-none opacity-50'
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-4">
          <div
            className={cn(
              'flex h-14 w-14 items-center justify-center rounded-full',
              isDragReject ? 'bg-destructive/10' : 'bg-muted'
            )}
          >
            {isUploading ? (
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            ) : isDragReject ? (
              <AlertCircle className="h-6 w-6 text-destructive" />
            ) : (
              <FileCode className="h-6 w-6 text-muted-foreground" />
            )}
          </div>
          <div>
            <p className="font-medium">
              {isDragActive
                ? isDragReject
                  ? 'Invalid file type'
                  : 'Drop your file here'
                : 'Drag and drop your notebook file'}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              or <span className="text-primary">click to browse</span>
            </p>
            <p className="mt-2 text-xs text-muted-foreground">Only .ipynb files up to 50MB</p>
          </div>
        </div>
      </div>

      {uploadProgress > 0 && (
        <div className="space-y-2">
          <Progress value={uploadProgress} className="h-2" />
          <p className="text-xs text-center text-muted-foreground">
            {uploadProgress === 100 ? 'Upload complete!' : `Uploading... ${uploadProgress}%`}
          </p>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}
    </div>
  );
}
