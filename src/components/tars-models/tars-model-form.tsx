'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import type { BaseModel, CreateTarsModelInput } from '@/types/api';

const createModelSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100),
  slug: z
    .string()
    .min(3, 'Slug must be at least 3 characters')
    .max(50)
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  description: z.string().max(500).optional(),
  priceCredits: z.number().min(1).max(10000),
});

type CreateModelFormData = z.infer<typeof createModelSchema>;

interface TarsModelFormProps {
  baseModel: BaseModel;
  onSubmit: (data: CreateTarsModelInput) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 50);
}

export function TarsModelForm({ baseModel, onSubmit, onCancel, isLoading }: TarsModelFormProps) {
  const [slugTouched, setSlugTouched] = useState(false);

  const form = useForm<CreateModelFormData>({
    resolver: zodResolver(createModelSchema),
    defaultValues: {
      title: '',
      slug: '',
      description: '',
      priceCredits: 10,
    },
  });

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    form.setValue('title', title);

    // Auto-generate slug if not manually touched
    if (!slugTouched) {
      form.setValue('slug', generateSlug(title));
    }
  };

  const handleSubmit = (data: CreateModelFormData) => {
    onSubmit({
      baseModelId: baseModel.id,
      title: data.title,
      slug: data.slug,
      description: data.description || undefined,
      priceCredits: data.priceCredits,
    });
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
      {/* Base Model Info */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Base Model</CardTitle>
          <CardDescription>
            You&apos;re creating a model based on <strong>{baseModel.name}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          {baseModel.description}
        </CardContent>
      </Card>

      {/* Form Fields */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Model Title *</Label>
          <Input
            id="title"
            placeholder="e.g., Anime Art Generator"
            {...form.register('title')}
            onChange={handleTitleChange}
          />
          {form.formState.errors.title && (
            <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug">URL Slug *</Label>
          <Input
            id="slug"
            placeholder="e.g., anime-art-generator"
            {...form.register('slug')}
            onFocus={() => setSlugTouched(true)}
          />
          <p className="text-xs text-muted-foreground">
            This will be part of your model&apos;s URL in the marketplace
          </p>
          {form.formState.errors.slug && (
            <p className="text-sm text-destructive">{form.formState.errors.slug.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Describe what your model does..."
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
          />
          <p className="text-xs text-muted-foreground">
            How many credits to charge per run (1-10000)
          </p>
          {form.formState.errors.priceCredits && (
            <p className="text-sm text-destructive">{form.formState.errors.priceCredits.message}</p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create Model
        </Button>
      </div>
    </form>
  );
}
