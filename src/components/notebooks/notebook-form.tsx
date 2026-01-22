'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { createNotebookSchema, type CreateNotebookFormData } from '@/lib/utils/validation';
import type { Notebook, GpuType, NotebookCategory } from '@/types/api';

interface NotebookFormProps {
  notebook?: Notebook;
  onSubmit: (data: CreateNotebookFormData) => void | Promise<void>;
  isSubmitting?: boolean;
}

const categories: { value: NotebookCategory; label: string }[] = [
  { value: 'image', label: 'Image Generation' },
  { value: 'text', label: 'Text Processing' },
  { value: 'video', label: 'Video Processing' },
  { value: 'audio', label: 'Audio Processing' },
  { value: 'other', label: 'Other' },
];

const gpuTypes: { value: GpuType; label: string; description: string }[] = [
  { value: 'T4', label: 'T4', description: '16GB VRAM - Basic workloads' },
  { value: 'L4', label: 'L4', description: '24GB VRAM - Standard workloads' },
  { value: 'A100', label: 'A100', description: '40GB VRAM - Heavy workloads' },
  { value: 'H100', label: 'H100', description: '80GB VRAM - Maximum performance' },
];

export function NotebookForm({ notebook, onSubmit, isSubmitting }: NotebookFormProps) {
  const form = useForm<CreateNotebookFormData>({
    resolver: zodResolver(createNotebookSchema),
    defaultValues: {
      title: notebook?.title || '',
      shortDescription: notebook?.shortDescription || '',
      description: notebook?.description || '',
      category: notebook?.category || 'image',
      gpuType: notebook?.gpuType || 'T4',
      priceCredits: notebook?.priceCredits || 10,
    },
  });

  const handleSubmit = async (data: CreateNotebookFormData) => {
    await onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="My Awesome AI Notebook"
                  disabled={isSubmitting}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                A catchy title for your notebook (3-100 characters)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Short Description */}
        <FormField
          control={form.control}
          name="shortDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Short Description</FormLabel>
              <FormControl>
                <Input
                  placeholder="A brief summary of what your notebook does"
                  disabled={isSubmitting}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Shown in search results and cards (10-200 characters)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Full Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Provide a detailed description of your notebook, including features, use cases, and any requirements..."
                  className="min-h-[150px] resize-y"
                  disabled={isSubmitting}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Detailed description shown on the notebook page (min 20 characters)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-6 sm:grid-cols-2">
          {/* Category */}
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isSubmitting}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>What type of content does your notebook process?</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* GPU Type */}
          <FormField
            control={form.control}
            name="gpuType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>GPU Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isSubmitting}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select GPU type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {gpuTypes.map((gpu) => (
                      <SelectItem key={gpu.value} value={gpu.value}>
                        <div className="flex flex-col">
                          <span>{gpu.label}</span>
                          <span className="text-xs text-muted-foreground">{gpu.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>Required GPU for running your notebook</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Price */}
        <FormField
          control={form.control}
          name="priceCredits"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price (Credits)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={1}
                  max={10000}
                  disabled={isSubmitting}
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                />
              </FormControl>
              <FormDescription>
                How many credits users pay per run (1-10,000 credits)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {notebook ? 'Save Changes' : 'Create Notebook'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
