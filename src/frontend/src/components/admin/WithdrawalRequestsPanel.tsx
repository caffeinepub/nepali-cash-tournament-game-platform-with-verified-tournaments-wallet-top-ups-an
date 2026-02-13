import { useGetWithdrawalRequests, useApproveWithdrawalRequest, useMarkWithdrawalRequestCompleted } from '../../hooks/useWithdrawals';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowDownCircle } from 'lucide-react';
import { t } from '../../i18n';
import { toast } from 'sonner';

export default function WithdrawalRequestsPanel() {
  const { data: requests, isLoading } = useGetWithdrawalRequests();
  const approveWithdrawal = useApproveWithdrawalRequest();
  const markCompleted = useMarkWithdrawalRequestCompleted();

  const handleApprove = async (requestId: string) => {
    try {
      await approveWithdrawal.mutateAsync(requestId as any);
      toast.success(t('withdrawalApproved'));
    } catch (error) {
      toast.error(t('error'));
    }
  };

  const handleMarkCompleted = async (requestId: string) => {
    try {
      await markCompleted.mutateAsync(requestId as any);
      toast.success(t('withdrawalCompleted'));
    } catch (error) {
      toast.error(t('error'));
    }
  };

  return (
    <Card className="border-2">
      <CardHeader>
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">
            <ArrowDownCircle className="h-7 w-7 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl">{t('withdrawalRequests')}</CardTitle>
            <CardDescription>सबै निकासी अनुरोधहरू</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : requests && requests.length > 0 ? (
          <div className="rounded-xl border-2 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">{t('user')}</TableHead>
                  <TableHead className="font-semibold">{t('amount')}</TableHead>
                  <TableHead className="font-semibold">{t('paymentProvider')}</TableHead>
                  <TableHead className="font-semibold">{t('payoutIdentifier')}</TableHead>
                  <TableHead className="font-semibold">{t('payoutName')}</TableHead>
                  <TableHead className="font-semibold">{t('status')}</TableHead>
                  <TableHead className="font-semibold">{t('actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((req) => (
                  <TableRow key={req.id.toString()} className="hover:bg-muted/30">
                    <TableCell className="font-mono text-xs">{req.userId.toString().slice(0, 10)}...</TableCell>
                    <TableCell className="font-semibold">रू {req.amount.amount.toString()}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{req.paymentProvider === 'imePay' ? t('imePay') : t('khalti')}</Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs">{req.payoutIdentifier}</TableCell>
                    <TableCell>{req.payoutName}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          req.status === 'completed'
                            ? 'secondary'
                            : req.status === 'rejected'
                            ? 'destructive'
                            : 'default'
                        }
                      >
                        {req.status === 'pending'
                          ? t('pending')
                          : req.status === 'approved'
                          ? t('approved')
                          : req.status === 'completed'
                          ? t('completed')
                          : t('rejected')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {req.status === 'pending' && (
                          <Button
                            size="sm"
                            onClick={() => handleApprove(req.id.toString())}
                            disabled={approveWithdrawal.isPending}
                          >
                            {approveWithdrawal.isPending ? t('approving') : t('approve')}
                          </Button>
                        )}
                        {req.status === 'approved' && (
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleMarkCompleted(req.id.toString())}
                            disabled={markCompleted.isPending}
                          >
                            {markCompleted.isPending ? t('markingCompleted') : t('markCompleted')}
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-12 font-medium">{t('noRequests')}</p>
        )}
      </CardContent>
    </Card>
  );
}
