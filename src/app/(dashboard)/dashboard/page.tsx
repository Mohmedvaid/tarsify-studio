'use client';

import Link from 'next/link';
import { Boxes, Play, Plus, ArrowRight, type LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { PageHeader } from '@/components/shared';
import { TarsModelStatusBadge } from '@/components/tars-models';
import { useAuth } from '@/hooks/use-auth';
import { useTarsModels } from '@/hooks';
import { formatRelativeTime } from '@/lib/utils/format';
import type { TarsModel } from '@/types/api';

// Simple stats card component
function StatsCard({
  title,
  value,
  description,
  icon: Icon,
}: {
  title: string;
  value: string | number;
  description: string;
  icon: LucideIcon;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

function StatsCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-4" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-16 mb-1" />
        <Skeleton className="h-3 w-20" />
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const { developer } = useAuth();
  const { data: models, isLoading: modelsLoading } = useTarsModels();

  // Type-safe models array
  const modelsArray = (models as TarsModel[] | undefined) || [];
  const totalModels = modelsArray.length;
  const publishedCount = modelsArray.filter((m) => m.status === 'PUBLISHED').length;
  const totalRuns = modelsArray.reduce((acc, m) => acc + (m.totalRuns ?? 0), 0);
  const draftCount = modelsArray.filter((m) => m.status === 'DRAFT').length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <PageHeader
        title={`Welcome back, ${developer?.displayName?.split(' ')[0] || 'Developer'}!`}
        description="Here's an overview of your Tars Models."
      />

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {modelsLoading ? (
          <>
            <StatsCardSkeleton />
            <StatsCardSkeleton />
            <StatsCardSkeleton />
            <StatsCardSkeleton />
          </>
        ) : (
          <>
            <StatsCard
              title="Total Models"
              value={totalModels}
              description={`${publishedCount} published`}
              icon={Boxes}
            />
            <StatsCard
              title="Total Runs"
              value={totalRuns.toLocaleString()}
              description="All time usage"
              icon={Play}
            />
            <StatsCard
              title="Published"
              value={publishedCount}
              description="Live in marketplace"
              icon={Boxes}
            />
            <StatsCard
              title="Drafts"
              value={draftCount}
              description="Ready to publish"
              icon={Boxes}
            />
          </>
        )}
      </div>

      {/* Quick Actions & Recent Models */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Get started with common tasks</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            <Button asChild className="justify-start">
              <Link href="/models/new">
                <Plus className="mr-2 h-4 w-4" />
                Create New Model
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-start">
              <Link href="/models">
                <Boxes className="mr-2 h-4 w-4" />
                Manage Models
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Recent Models */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Models</CardTitle>
              <CardDescription>Your latest model activity</CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link href="/models">
                View all
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {modelsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                    <Skeleton className="h-5 w-16" />
                  </div>
                ))}
              </div>
            ) : modelsArray.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Boxes className="mb-3 h-10 w-10 text-muted-foreground" />
                <p className="text-sm font-medium">No models yet</p>
                <p className="text-xs text-muted-foreground">
                  Create your first Tars Model to get started
                </p>
                <Button asChild size="sm" className="mt-4">
                  <Link href="/models/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Model
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {modelsArray.slice(0, 5).map((model) => (
                  <ModelListItem key={model.id} model={model} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ModelListItem({ model }: { model: TarsModel }) {
  return (
    <Link
      href={`/models/${model.id}`}
      className="flex items-center justify-between rounded-lg p-2 transition-colors hover:bg-slate-50"
    >
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{model.title}</p>
        <p className="text-xs text-muted-foreground">
          Updated {formatRelativeTime(model.updatedAt)}
        </p>
      </div>
      <TarsModelStatusBadge status={model.status} />
    </Link>
  );
}
