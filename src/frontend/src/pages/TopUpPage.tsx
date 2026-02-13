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
        <h1 className="text-3xl font-bold mb-2 tracking-tight">{t('topUp')}</h1>
        <p className="text-muted-foreground">तपाईंको वालेटमा रकम थप्नुहोस्</p>
      </div>

      {/* Top Up Request Form */}
      <Card className="border-2 shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">
              <ArrowUpCircle className="h-7 w-7 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">{t('requestTopUp')}</CardTitle>
              <CardDescription>नयाँ टप अप अनुरोध सिर्जना गर्नुहोस्</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-base font-medium">{t('topUpAmount')}</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={t('amountPlaceholder')}
                min="1"
                required
                className="h-11"
              />
            </div>
            <Button type="submit" disabled={createTopUp.isPending} className="w-full h-11">
              {createTopUp.isPending ? t('requesting') : t('submit')}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Top Up History */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="text-xl">{t('topUpHistory')}</CardTitle>
          <CardDescription>तपाईंको टप अप अनुरोधहरू</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : history && history.length > 0 ? (
            <div className="rounded-xl border-2 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">{t('amount')}</TableHead>
                    <TableHead className="font-semibold">{t('status')}</TableHead>
                    <TableHead className="font-semibold">{t('date')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.map((req) => (
                    <TableRow key={req.id.toString()} className="hover:bg-muted/30">
                      <TableCell className="font-semibold">रू {req.amount.amount.toString()}</TableCell>
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
            <p className="text-center text-muted-foreground py-12 font-medium">{t('noTopUpRequests')}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
