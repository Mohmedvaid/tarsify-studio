'use client';

import Link from 'next/link';
import { Plus, Boxes } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/shared';
import { TarsModelCard } from '@/components/tars-models';
import { EmptyState } from '@/components/shared';
import { LoadingSpinner } from '@/components/shared';
import { ErrorMessage } from '@/components/shared';
import { useTarsModels } from '@/hooks';
import type { TarsModel } from '@/types/api';

export default function ModelsPage() {
  const { data: models, isLoading, error } = useTarsModels();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorMessage
        title="Failed to load models"
        message="We couldn't load your Tars Models. Please try again."
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Models"
        description="Create and manage your Tars Models"
        action={
          <Button asChild>
            <Link href="/models/new">
              <Plus className="mr-2 h-4 w-4" />
              Create Model
            </Link>
          </Button>
        }
      />

      {!models || models.length === 0 ? (
        <EmptyState
          icon={Boxes}
          title="No models yet"
          description="Get started by creating your first Tars Model from one of our base models."
          action={
            <Button asChild>
              <Link href="/models/new">
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Model
              </Link>
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {(models as TarsModel[]).map((model) => (
            <TarsModelCard key={model.id} model={model} />
          ))}
        </div>
      )}
    </div>
  );
}
