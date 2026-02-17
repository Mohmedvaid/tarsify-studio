'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Loader2, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/shared';
import { LoadingSpinner } from '@/components/shared';
import { ErrorMessage } from '@/components/shared';
import { useTarsModel, useUpdateTarsModel } from '@/hooks';

interface EditModelPageProps {
  params: Promise<{ id: string }>;
}

const editModelSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100),
  description: z.string().max(500).optional(),
  priceCredits: z.number().min(1).max(10000),
});

type EditModelFormData = z.infer<typeof editModelSchema>;

export default function EditModelPage({ params }: EditModelPageProps) {
  const { id } = use(params);
  const router = useRouter();

  const { data: model, isLoading, error } = useTarsModel(id);
  const updateModel = useUpdateTarsModel();

  const form = useForm<EditModelFormData>({
    resolver: zodResolver(editModelSchema),
    values: model
      ? {
          title: model.title,
          description: model.description || '',
          priceCredits: model.priceCredits,
        }
      : undefined,
  });

  const handleSubmit = async (data: EditModelFormData) => {
    try {
      await updateModel.mutateAsync({
        id,
        data: {
          title: data.title,
          description: data.description || undefined,
          priceCredits: data.priceCredits,
        },
      });
      router.push(`/models/${id}`);
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

  const isPublished = model.status === 'PUBLISHED';

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/models/${id}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <PageHeader
          title={`Edit ${model.title}`}
          description="Update your model settings"
        />
      </div>

      {isPublished && (
        <Card className="border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-yellow-700 dark:text-yellow-300">
              Published Model
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-yellow-600 dark:text-yellow-400">
            This model is published. Some fields cannot be changed. To make major changes,
            you&apos;ll need to unpublish first.
          </CardContent>
        </Card>
      )}

      <form onSubmit={form.handleSubmit(handleSubmit)} className="max-w-2xl space-y-6">
        {/* Base Model Info (Read-only) */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Base Model</CardTitle>
            <CardDescription>{model.baseModel?.name ?? 'Unknown'}</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            The base model cannot be changed after creation.
          </CardContent>
        </Card>

        {/* Editable Fields */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Model Title *</Label>
            <Input
              id="title"
              {...form.register('title')}
              disabled={isPublished}
            />
            {form.formState.errors.title && (
              <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">URL Slug</Label>
            <Input
              id="slug"
              value={model.slug}
              disabled
              className="bg-muted"
            />
            <p className="text-xs text-muted-foreground">
              Slug cannot be changed after creation
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              rows={3}
              {...form.register('description')}
            />
            {form.formState.errors.description && (
              <p className="text-sm text-destructive">{form.formState.errors.description.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="priceCredits">Price (Credits) *</Label>
            <Input
              id="priceCredits"
              type="number"
              min={1}
              max={10000}
              {...form.register('priceCredits', { valueAsNumber: true })}
              disabled={isPublished}
            />
            {form.formState.errors.priceCredits && (
              <p className="text-sm text-destructive">{form.formState.errors.priceCredits.message}</p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button type="button" variant="outline" asChild>
            <Link href={`/models/${id}`}>Cancel</Link>
          </Button>
          <Button type="button" variant="secondary" asChild>
            <Link href={`/models/${id}/test`}>
              <Play className="mr-2 h-4 w-4" />
              Preview
            </Link>
          </Button>
          <Button type="submit" disabled={updateModel.isPending}>
            {updateModel.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
