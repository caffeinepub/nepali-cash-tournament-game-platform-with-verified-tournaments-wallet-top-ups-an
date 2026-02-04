import { useState } from 'react';
import { useRequestWithdrawal, useGetWithdrawalRequests } from '../hooks/useWithdrawals';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowDownCircle } from 'lucide-react';
import { t } from '../i18n';
import { toast } from 'sonner';
import { Variant_imePay_khalti } from '../backend';

export default function WithdrawPage() {
  const [amount, setAmount] = useState('');
  const [provider, setProvider] = useState<'imePay' | 'khalti'>('imePay');
  const [identifier, setIdentifier] = useState('');
  const [payoutName, setPayoutName] = useState('');
  const requestWithdrawal = useRequestWithdrawal();
  const { data: requests, isLoading } = useGetWithdrawalRequests();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseInt(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      toast.error('कृपया मान्य रकम प्रविष्ट गर्नुहोस्');
      return;
    }

    if (!identifier.trim() || !payoutName.trim()) {
      toast.error('कृपया सबै फिल्डहरू भर्नुहोस्');
      return;
    }

    try {
      await requestWithdrawal.mutateAsync({
        amount: { amount: BigInt(amountNum) },
        provider: Variant_imePay_khalti[provider],
        identifier: identifier.trim(),
        payoutName: payoutName.trim(),
      });
      toast.success(t('withdrawalRequested'));
      setAmount('');
      setIdentifier('');
      setPayoutName('');
    } catch (error) {
      toast.error(t('error'));
    }
  };

  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: t('pending'),
      approved: t('approved'),
      completed: t('completed'),
      rejected: t('rejected'),
    };
    return statusMap[status] || status;
  };

  const getStatusVariant = (status: string): 'default' | 'secondary' | 'destructive' => {
    if (status === 'completed') return 'secondary';
    if (status === 'rejected') return 'destructive';
    return 'default';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">{t('withdraw')}</h1>
        <p className="text-muted-foreground">तपाईंको वालेटबाट रकम निकाल्नुहोस्</p>
      </div>

      {/* Withdrawal Request Form */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <ArrowDownCircle className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle>{t('requestWithdrawal')}</CardTitle>
              <CardDescription>नयाँ निकासी अनुरोध सिर्जना गर्नुहोस्</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">{t('withdrawAmount')}</Label>
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

            <div className="space-y-2">
              <Label htmlFor="provider">{t('paymentProvider')}</Label>
              <Select value={provider} onValueChange={(v) => setProvider(v as 'imePay' | 'khalti')}>
                <SelectTrigger id="provider">
                  <SelectValue placeholder={t('selectProvider')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="imePay">{t('imePay')}</SelectItem>
                  <SelectItem value="khalti">{t('khalti')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="identifier">{t('payoutIdentifier')}</Label>
              <Input
                id="identifier"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder={t('phoneOrAccount')}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="payoutName">{t('payoutName')}</Label>
              <Input
                id="payoutName"
                value={payoutName}
                onChange={(e) => setPayoutName(e.target.value)}
                placeholder={t('accountHolderName')}
                required
              />
            </div>

            <Button type="submit" disabled={requestWithdrawal.isPending} className="w-full">
              {requestWithdrawal.isPending ? t('requesting') : t('submit')}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Withdrawal History */}
      <Card>
        <CardHeader>
          <CardTitle>{t('withdrawalHistory')}</CardTitle>
          <CardDescription>तपाईंको निकासी अनुरोधहरू</CardDescription>
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
                    <TableHead>{t('amount')}</TableHead>
                    <TableHead>{t('paymentProvider')}</TableHead>
                    <TableHead>{t('status')}</TableHead>
                    <TableHead>{t('date')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.map((req) => (
                    <TableRow key={req.id.toString()}>
                      <TableCell className="font-medium">रू {req.amount.amount.toString()}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{req.paymentProvider === 'imePay' ? t('imePay') : t('khalti')}</Badge>
                      </TableCell>
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
            <p className="text-center text-muted-foreground py-8">{t('noWithdrawalRequests')}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
