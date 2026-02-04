import { useNavigate } from '@tanstack/react-router';
import { useGetBalance } from '../hooks/useWallet';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Wallet, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { t } from '../i18n';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { data: balance, isLoading } = useGetBalance();

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div
        className="relative rounded-xl overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5 p-8 md:p-12"
        style={{
          backgroundImage: 'url(/assets/generated/hero-bg.dim_1600x900.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="relative z-10 backdrop-blur-sm bg-background/80 rounded-lg p-6 max-w-2xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{t('welcome')}</h1>
          <p className="text-muted-foreground mb-6">प्रतियोगितामा सामेल हुनुहोस् र पुरस्कार जित्नुहोस्!</p>
          
          <div className="bg-card rounded-lg p-4 border">
            <p className="text-sm text-muted-foreground mb-1">{t('yourBalance')}</p>
            {isLoading ? (
              <Skeleton className="h-8 w-32" />
            ) : (
              <p className="text-3xl font-bold">रू {balance?.amount.toString() || '0'}</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold mb-4">{t('quickActions')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate({ to: '/tournaments' })}>
            <CardHeader>
              <Trophy className="h-8 w-8 text-primary mb-2" />
              <CardTitle>{t('tournaments')}</CardTitle>
              <CardDescription>{t('viewTournaments')}</CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate({ to: '/wallet' })}>
            <CardHeader>
              <Wallet className="h-8 w-8 text-primary mb-2" />
              <CardTitle>{t('wallet')}</CardTitle>
              <CardDescription>{t('viewWallet')}</CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate({ to: '/topup' })}>
            <CardHeader>
              <ArrowUpCircle className="h-8 w-8 text-primary mb-2" />
              <CardTitle>{t('topUp')}</CardTitle>
              <CardDescription>{t('addFunds')}</CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate({ to: '/withdraw' })}>
            <CardHeader>
              <ArrowDownCircle className="h-8 w-8 text-primary mb-2" />
              <CardTitle>{t('withdraw')}</CardTitle>
              <CardDescription>{t('withdrawFunds')}</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
}
