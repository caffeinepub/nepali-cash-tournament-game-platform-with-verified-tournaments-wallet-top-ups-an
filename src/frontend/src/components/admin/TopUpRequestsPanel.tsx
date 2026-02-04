import { useGetTopUpRequests, useApproveTopUpRequest } from '../../hooks/useTopUps';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowUpCircle } from 'lucide-react';
import { t } from '../../i18n';
import { toast } from 'sonner';

export default function TopUpRequestsPanel() {
  const { data: requests, isLoading } = useGetTopUpRequests();
  const approveTopUp = useApproveTopUpRequest();

  const handleApprove = async (requestId: string) => {
    try {
      await approveTopUp.mutateAsync(requestId as any);
      toast.success(t('topUpApproved'));
    } catch (error) {
      toast.error(t('error'));
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <ArrowUpCircle className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle>{t('topUpRequests')}</CardTitle>
            <CardDescription>सबै टप अप अनुरोधहरू</CardDescription>
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
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('user')}</TableHead>
                  <TableHead>{t('amount')}</TableHead>
                  <TableHead>{t('status')}</TableHead>
                  <TableHead>{t('actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((req) => (
                  <TableRow key={req.id.toString()}>
                    <TableCell className="font-mono text-xs">{req.userId.toString().slice(0, 10)}...</TableCell>
                    <TableCell className="font-medium">रू {req.amount.amount.toString()}</TableCell>
                    <TableCell>
                      <Badge variant={req.status === 'pending' ? 'default' : 'secondary'}>
                        {req.status === 'pending' ? t('pending') : t('completed')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {req.status === 'pending' && (
                        <Button
                          size="sm"
                          onClick={() => handleApprove(req.id.toString())}
                          disabled={approveTopUp.isPending}
                        >
                          {approveTopUp.isPending ? t('approving') : t('approve')}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-8">{t('noRequests')}</p>
        )}
      </CardContent>
    </Card>
  );
}
