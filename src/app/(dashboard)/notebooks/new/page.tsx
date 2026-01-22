'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { NotebookForm } from '@/components/notebooks/notebook-form';
import { useCreateNotebook } from '@/hooks/use-notebooks';
import type { CreateNotebookFormData } from '@/lib/utils/validation';

export default function NewNotebookPage() {
  const router = useRouter();
  const createNotebook = useCreateNotebook();

  const handleSubmit = async (data: CreateNotebookFormData) => {
    const notebook = await createNotebook.mutateAsync({
      title: data.title,
      shortDescription: data.shortDescription,
      description: data.description,
      category: data.category,
      gpuType: data.gpuType,
      priceCredits: data.priceCredits,
    });
    router.push(`/notebooks/${notebook.id}/edit`);
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

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Create New Notebook</CardTitle>
          <CardDescription>
            Fill in the details below to create a new AI notebook. You can upload your .ipynb file
            after creating the notebook.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <NotebookForm onSubmit={handleSubmit} isSubmitting={createNotebook.isPending} />
        </CardContent>
      </Card>
    </div>
  );
}
