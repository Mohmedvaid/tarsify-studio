'use client';

import { PageHeader } from '@/components/shared/page-header';
import { StatsCard, StatsCardSkeleton, SimpleChart, BarChartHorizontal, RecentRuns } from '@/components/analytics';
import { useAnalyticsOverview, useAnalyticsTrends, useTopNotebooks, useRecentRuns } from '@/hooks/use-analytics';
import { formatCredits } from '@/lib/utils/format';
import { BarChart3, Eye, Play, Coins, TrendingUp } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function AnalyticsPage() {
  const { data: overview, isLoading: overviewLoading } = useAnalyticsOverview();
  const { data: trends, isLoading: trendsLoading } = useAnalyticsTrends(30);
  const { data: topNotebooks, isLoading: topLoading } = useTopNotebooks(5);
  const { data: recentRuns, isLoading: runsLoading } = useRecentRuns(10);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        description="Track your notebook performance and earnings"
      />

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {overviewLoading ? (
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
              value={overview?.totalNotebooks ?? 0}
              description="Published notebooks"
              icon={BarChart3}
            />
            <StatsCard
              title="Total Runs"
              value={(overview?.totalRuns ?? 0).toLocaleString()}
              description={`${overview?.runsToday ?? 0} today`}
              icon={Play}
              trend={{ value: 12, isPositive: true }}
            />
            <StatsCard
              title="Total Views"
              value={(overview?.viewsToday ?? 0).toLocaleString()}
              description="Views today"
              icon={Eye}
            />
            <StatsCard
              title="Total Earnings"
              value={formatCredits(overview?.totalEarnings ?? 0)}
              description="All time"
              icon={Coins}
              trend={{ value: 8, isPositive: true }}
            />
          </>
        )}
      </div>

      {/* Charts */}
      <Tabs defaultValue="runs" className="space-y-4">
        <TabsList>
          <TabsTrigger value="runs">Runs</TabsTrigger>
          <TabsTrigger value="earnings">Earnings</TabsTrigger>
          <TabsTrigger value="views">Views</TabsTrigger>
        </TabsList>

        <TabsContent value="runs">
          <SimpleChart
            title="Daily Runs"
            description="Number of notebook executions per day"
            data={trends?.runs ?? []}
            loading={trendsLoading}
            color="blue"
          />
        </TabsContent>

        <TabsContent value="earnings">
          <SimpleChart
            title="Daily Earnings"
            description="Credits earned per day"
            data={trends?.earnings ?? []}
            loading={trendsLoading}
            valuePrefix=""
            valueSuffix=" credits"
            color="green"
          />
        </TabsContent>

        <TabsContent value="views">
          <SimpleChart
            title="Daily Views"
            description="Notebook page views per day"
            data={trends?.views ?? []}
            loading={trendsLoading}
            color="purple"
          />
        </TabsContent>
      </Tabs>

      {/* Bottom section */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Top Notebooks */}
        <BarChartHorizontal
          title="Top Notebooks"
          description="By total runs"
          data={
            topNotebooks?.map((n) => ({
              label: n.title,
              value: n.runs,
              sublabel: `${formatCredits(n.earnings)} earned`,
            })) ?? []
          }
          loading={topLoading}
          color="blue"
        />

        {/* Recent Runs */}
        <RecentRuns runs={recentRuns ?? []} loading={runsLoading} />
      </div>

      {/* Note about mock data */}
      <div className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">
        <TrendingUp className="h-4 w-4 inline mr-2" />
        This page uses <span className="font-medium">mock data</span> for demonstration.
        See <code className="text-xs bg-muted px-1 rounded">DEVELOPMENT.md</code> for details.
      </div>
    </div>
  );
}
