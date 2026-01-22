'use client';

import Link from 'next/link';
import { BookOpen, BarChart3, DollarSign, Play, Plus, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/shared';
import { StatsCard, StatsCardSkeleton } from '@/components/analytics';
import { useAuth } from '@/hooks/use-auth';
import { useNotebooks } from '@/hooks/use-notebooks';
import { formatCredits, formatCurrency, formatRelativeTime } from '@/lib/utils/format';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { NOTEBOOK_STATUS_CONFIG } from '@/lib/constants';
import type { Notebook, NotebookStatus } from '@/types/api';

export default function DashboardPage() {
  const { developer } = useAuth();
  const { data: notebooksData, isLoading: notebooksLoading } = useNotebooks({ limit: 5 });

  const notebooks = notebooksData?.data || [];
  const totalNotebooks = notebooksData?.pagination?.total || 0;

  // Calculate stats (mock data for now since analytics API isn't ready)
  const publishedCount = notebooks.filter((n) => n.status === 'published').length;
  const totalRuns = notebooks.reduce((acc, n) => acc + n.totalRuns, 0);
  const earningsBalance = developer?.earningsBalance || 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <PageHeader
        title={`Welcome back, ${developer?.name?.split(' ')[0] || 'Developer'}!`}
        description="Here's what's happening with your notebooks."
      />

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {notebooksLoading ? (
          <>
            <StatsCardSkeleton />
            <StatsCardSkeleton />
            <StatsCardSkeleton />
            <StatsCardSkeleton />
          </>
        ) : (
          <>
            <StatsCard
              title="Total Notebooks"
              value={totalNotebooks}
              description={`${publishedCount} published`}
              icon={BookOpen}
            />
            <StatsCard
              title="Total Runs"
              value={totalRuns.toLocaleString()}
              description="All time"
              icon={Play}
            />
            <StatsCard
              title="Views Today"
              value="—"
              description="Coming soon"
              icon={BarChart3}
            />
            <StatsCard
              title="Earnings Balance"
              value={formatCurrency(earningsBalance)}
              description="Available for payout"
              icon={DollarSign}
            />
          </>
        )}
      </div>

      {/* Quick Actions & Recent Notebooks */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Get started with common tasks</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            <Button asChild className="justify-start">
              <Link href="/notebooks/new">
                <Plus className="mr-2 h-4 w-4" />
                Create New Notebook
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-start">
              <Link href="/notebooks">
                <BookOpen className="mr-2 h-4 w-4" />
                Manage Notebooks
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-start">
              <Link href="/analytics">
                <BarChart3 className="mr-2 h-4 w-4" />
                View Analytics
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-start">
              <Link href="/earnings">
                <DollarSign className="mr-2 h-4 w-4" />
                View Earnings
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Recent Notebooks */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Notebooks</CardTitle>
              <CardDescription>Your latest notebook activity</CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link href="/notebooks">
                View all
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {notebooksLoading ? (
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
            ) : notebooks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <BookOpen className="mb-3 h-10 w-10 text-muted-foreground" />
                <p className="text-sm font-medium">No notebooks yet</p>
                <p className="text-xs text-muted-foreground">
                  Create your first notebook to get started
                </p>
                <Button asChild size="sm" className="mt-4">
                  <Link href="/notebooks/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Notebook
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {notebooks.slice(0, 5).map((notebook) => (
                  <NotebookListItem key={notebook.id} notebook={notebook} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function NotebookListItem({ notebook }: { notebook: Notebook }) {
  const statusConfig = NOTEBOOK_STATUS_CONFIG[notebook.status as NotebookStatus];

  return (
    <Link
      href={`/notebooks/${notebook.id}`}
      className="flex items-center justify-between rounded-lg p-2 transition-colors hover:bg-slate-50"
    >
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{notebook.title}</p>
        <p className="text-xs text-muted-foreground">
          Updated {formatRelativeTime(notebook.updatedAt)}
        </p>
      </div>
      <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
    </Link>
  );
}
