'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/shared';
import { BaseModelCard, TarsModelForm } from '@/components/tars-models';
import { LoadingSpinner } from '@/components/shared';
import { ErrorMessage } from '@/components/shared';
import { useBaseModels, useCreateTarsModel } from '@/hooks';
import type { BaseModel } from '@/types/api';

type Step = 'select-base' | 'configure';

export default function NewModelPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('select-base');
  const [selectedBase, setSelectedBase] = useState<BaseModel | null>(null);

  const { data: baseModels, isLoading, error } = useBaseModels();
  const createModel = useCreateTarsModel();

  const handleSelectBase = (baseModel: BaseModel) => {
    setSelectedBase(baseModel);
    setStep('configure');
  };

  const handleBack = () => {
    setStep('select-base');
    setSelectedBase(null);
  };

  const handleCancel = () => {
    router.push('/models');
  };

  const handleCreate = async (data: Parameters<typeof createModel.mutateAsync>[0]) => {
    try {
      const newModel = await createModel.mutateAsync(data);
      router.push(`/models/${newModel.id}`);
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

  if (error) {
    return (
      <ErrorMessage
        title="Failed to load base models"
        message="We couldn't load the available base models. Please try again."
      />
    );
  }

  return (
    <div className="space-y-6">
      {step === 'select-base' && (
        <>
          <PageHeader
            title="Create a New Model"
            description="Choose a base model to get started. You'll customize it in the next step."
          />

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {(baseModels as BaseModel[] | undefined)?.map((baseModel) => (
              <BaseModelCard
                key={baseModel.id}
                baseModel={baseModel}
                onSelect={handleSelectBase}
              />
            ))}
          </div>

          {(!baseModels || baseModels.length === 0) && (
            <div className="text-center py-12 text-muted-foreground">
              No base models available at this time.
            </div>
          )}
        </>
      )}

      {step === 'configure' && selectedBase && (
        <>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <PageHeader
              title="Configure Your Model"
              description={`Creating a model based on ${selectedBase.name}`}
            />
          </div>

          <div className="max-w-2xl">
            <TarsModelForm
              baseModel={selectedBase}
              onSubmit={handleCreate}
              onCancel={handleCancel}
              isLoading={createModel.isPending}
            />
          </div>
        </>
      )}

      <div className="mt-8 pt-4 border-t">
        <Button variant="ghost" asChild>
          <Link href="/models">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to My Models
          </Link>
        </Button>
      </div>
    </div>
  );
}
