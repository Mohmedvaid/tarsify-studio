'use client';

import { PageHeader } from '@/components/shared/page-header';
import { StatsCard, StatsCardSkeleton, BarChartHorizontal } from '@/components/analytics';
import { useEarningsSummary, useEarningsBreakdown, usePayouts, useRequestPayout } from '@/hooks/use-earnings';
import { formatCredits } from '@/lib/utils/format';
import { Wallet, Clock, Coins, ArrowUpRight, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { format } from 'date-fns';
import type { PayoutStatus } from '@/types/api';

const MINIMUM_PAYOUT = 5000; // 5000 credits minimum for payout

export default function EarningsPage() {
  const { data: summary, isLoading: summaryLoading } = useEarningsSummary();
  const { data: breakdown, isLoading: breakdownLoading } = useEarningsBreakdown();
  const { data: payouts, isLoading: payoutsLoading } = usePayouts();
  const requestPayout = useRequestPayout();

  const canRequestPayout = (summary?.availableBalance ?? 0) >= MINIMUM_PAYOUT;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Earnings"
        description="Track your revenue and request payouts"
      />

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        {summaryLoading ? (
          <>
            <StatsCardSkeleton />
            <StatsCardSkeleton />
            <StatsCardSkeleton />
          </>
        ) : (
          <>
            <StatsCard
              title="Available Balance"
              value={formatCredits(summary?.availableBalance ?? 0)}
              description="Ready to withdraw"
              icon={Wallet}
            />
            <StatsCard
              title="Pending"
              value={formatCredits(summary?.pendingBalance ?? 0)}
              description="Processing from recent runs"
              icon={Clock}
            />
            <StatsCard
              title="Total Earned"
              value={formatCredits(summary?.totalEarned ?? 0)}
              description="All time earnings"
              icon={Coins}
              trend={{ value: 15, isPositive: true }}
            />
          </>
        )}
      </div>

      {/* Payout Action */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Request Payout</CardTitle>
          <CardDescription>
            Minimum payout amount is {formatCredits(MINIMUM_PAYOUT)}. Payouts are processed within 3-5 business days.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">{formatCredits(summary?.availableBalance ?? 0)}</p>
              <p className="text-sm text-muted-foreground">Available for payout</p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button disabled={!canRequestPayout || requestPayout.isPending}>
                  {requestPayout.isPending ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <ArrowUpRight className="h-4 w-4 mr-2" />
                  )}
                  Request Payout
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Request Payout</AlertDialogTitle>
                  <AlertDialogDescription>
                    You are about to request a payout of {formatCredits(summary?.availableBalance ?? 0)}.
                    This will be sent to your registered payout email.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => requestPayout.mutate()}>
                    Confirm Payout
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          {!canRequestPayout && (
            <p className="mt-3 text-sm text-muted-foreground flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              You need at least {formatCredits(MINIMUM_PAYOUT)} to request a payout
            </p>
          )}
        </CardContent>
      </Card>

      {/* Two column layout */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Earnings Breakdown */}
        <BarChartHorizontal
          title="Earnings by Notebook"
          description="Revenue from each published notebook"
          data={
            breakdown?.map((item) => ({
              label: item.notebookTitle,
              value: item.totalEarnings,
              sublabel: `${item.totalRuns.toLocaleString()} runs`,
            })) ?? []
          }
          loading={breakdownLoading}
          valueSuffix=" credits"
          color="green"
        />

        {/* Payout History */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Payout History</CardTitle>
            <CardDescription>Your previous payout requests</CardDescription>
          </CardHeader>
          <CardContent>
            {payoutsLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : payouts?.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Wallet className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No payouts yet</p>
                <p className="text-sm">Your payout history will appear here</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payouts?.map((payout) => (
                    <TableRow key={payout.id}>
                      <TableCell className="text-sm">
                        {format(new Date(payout.createdAt), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatCredits(payout.amount)}
                      </TableCell>
                      <TableCell>
                        <PayoutStatusBadge status={payout.status} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function PayoutStatusBadge({ status }: { status: PayoutStatus }) {
  const config: Record<PayoutStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    pending: { label: 'Pending', variant: 'secondary' },
    processing: { label: 'Processing', variant: 'default' },
    completed: { label: 'Completed', variant: 'outline' },
    failed: { label: 'Failed', variant: 'destructive' },
  };

  const { label, variant } = config[status];

  return (
    <Badge variant={variant} className="flex items-center gap-1 w-fit">
      {status === 'completed' && <CheckCircle2 className="h-3 w-3" />}
      {status === 'processing' && <Loader2 className="h-3 w-3 animate-spin" />}
      {label}
    </Badge>
  );
}
