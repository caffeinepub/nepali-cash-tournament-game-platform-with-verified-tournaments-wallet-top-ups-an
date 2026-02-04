import { useGetBalance, useGetTransactionHistory } from '../hooks/useWallet';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Wallet as WalletIcon } from 'lucide-react';
import { t } from '../i18n';

export default function WalletPage() {
  const { data: balance, isLoading: balanceLoading } = useGetBalance();
  const { data: transactions, isLoading: transactionsLoading } = useGetTransactionHistory();

  const getTransactionTypeLabel = (type: string) => {
    const typeMap: Record<string, string> = {
      deposit: t('deposit'),
      withdrawal: t('withdrawal'),
      prize: t('prize'),
      topUp: t('topUpTransaction'),
      withdrawalRequest: t('withdrawalRequest'),
    };
    return typeMap[type] || type;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">{t('wallet')}</h1>
        <p className="text-muted-foreground">तपाईंको ब्यालेन्स र लेनदेन इतिहास</p>
      </div>

      {/* Balance Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <WalletIcon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle>{t('balance')}</CardTitle>
              <CardDescription>तपाईंको हालको ब्यालेन्स</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {balanceLoading ? (
            <Skeleton className="h-12 w-48" />
          ) : (
            <p className="text-4xl font-bold">रू {balance?.amount.toString() || '0'}</p>
          )}
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle>{t('transactionHistory')}</CardTitle>
          <CardDescription>तपाईंको सबै लेनदेनहरू</CardDescription>
        </CardHeader>
        <CardContent>
          {transactionsLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : transactions && transactions.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('type')}</TableHead>
                    <TableHead>{t('amount')}</TableHead>
                    <TableHead>{t('date')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((tx) => (
                    <TableRow key={tx.id.toString()}>
                      <TableCell>
                        <Badge variant="outline">{getTransactionTypeLabel(tx.transactionType)}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">रू {tx.amount.amount.toString()}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(Number(tx.createdAt) / 1000000).toLocaleDateString('ne-NP')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">{t('noTransactions')}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
