import { useState } from 'react';
import { useCreateTopUpRequest, useGetTopUpHistory } from '../hooks/useTopUps';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowUpCircle } from 'lucide-react';
import { t } from '../i18n';
import { toast } from 'sonner';

export default function TopUpPage() {
  const [amount, setAmount] = useState('');
  const createTopUp = useCreateTopUpRequest();
  const { data: history, isLoading } = useGetTopUpHistory();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseInt(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      toast.error('कृपया मान्य रकम प्रविष्ट गर्नुहोस्');
      return;
    }

    try {
      await createTopUp.mutateAsync({ amount: BigInt(amountNum) });
      toast.success(t('topUpRequested'));
      setAmount('');
    } catch (error) {
      toast.error(t('error'));
    }
  };

  const getStatusLabel = (status: string) => {
    return status === 'pending' ? t('pending') : t('completed');
  };

  const getStatusVariant = (status: string): 'default' | 'secondary' => {
    return status === 'pending' ? 'default' : 'secondary';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">{t('topUp')}</h1>
        <p className="text-muted-foreground">तपाईंको वालेटमा रकम थप्नुहोस्</p>
      </div>

      {/* Top Up Request Form */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <ArrowUpCircle className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle>{t('requestTopUp')}</CardTitle>
              <CardDescription>नयाँ टप अप अनुरोध सिर्जना गर्नुहोस्</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">{t('topUpAmount')}</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={t('amountPlaceholder')}
                min="1"
                required
              />
            </div>
            <Button type="submit" disabled={createTopUp.isPending} className="w-full">
              {createTopUp.isPending ? t('requesting') : t('submit')}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Top Up History */}
      <Card>
        <CardHeader>
          <CardTitle>{t('topUpHistory')}</CardTitle>
          <CardDescription>तपाईंको टप अप अनुरोधहरू</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : history && history.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('amount')}</TableHead>
                    <TableHead>{t('status')}</TableHead>
                    <TableHead>{t('date')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.map((req) => (
                    <TableRow key={req.id.toString()}>
                      <TableCell className="font-medium">रू {req.amount.amount.toString()}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(req.status)}>{getStatusLabel(req.status)}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(Number(req.createdAt) / 1000000).toLocaleDateString('ne-NP')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">{t('noTopUpRequests')}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
