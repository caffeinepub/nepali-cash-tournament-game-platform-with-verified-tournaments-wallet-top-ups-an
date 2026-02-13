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
    <div className="space-y-8">
      {/* Hero Section */}
      <div
        className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-primary/15 to-primary/5 p-8 md:p-12 border shadow-lg"
        style={{
          backgroundImage: 'url(/assets/generated/hero-bg.dim_1600x900.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="relative z-10 backdrop-blur-md bg-background/85 rounded-xl p-6 max-w-2xl border shadow-sm">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 tracking-tight">{t('welcome')}</h1>
          <p className="text-muted-foreground mb-6">प्रतियोगितामा सामेल हुनुहोस् र पुरस्कार जित्नुहोस्!</p>
          
          <div className="bg-card rounded-xl p-5 border shadow-sm">
            <p className="text-sm text-muted-foreground mb-1 font-medium">{t('yourBalance')}</p>
            {isLoading ? (
              <Skeleton className="h-9 w-32" />
            ) : (
              <p className="text-3xl font-bold text-primary">रू {balance?.amount.toString() || '0'}</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold mb-5 tracking-tight">{t('quickActions')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="hover:shadow-xl hover:scale-[1.02] transition-all cursor-pointer border-2 hover:border-primary/50" onClick={() => navigate({ to: '/tournaments' })}>
            <CardHeader className="pb-3">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                <Trophy className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-lg">{t('tournaments')}</CardTitle>
              <CardDescription>{t('viewTournaments')}</CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-xl hover:scale-[1.02] transition-all cursor-pointer border-2 hover:border-primary/50" onClick={() => navigate({ to: '/wallet' })}>
            <CardHeader className="pb-3">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                <Wallet className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-lg">{t('wallet')}</CardTitle>
              <CardDescription>{t('viewWallet')}</CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-xl hover:scale-[1.02] transition-all cursor-pointer border-2 hover:border-primary/50" onClick={() => navigate({ to: '/topup' })}>
            <CardHeader className="pb-3">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                <ArrowUpCircle className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-lg">{t('topUp')}</CardTitle>
              <CardDescription>{t('addFunds')}</CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-xl hover:scale-[1.02] transition-all cursor-pointer border-2 hover:border-primary/50" onClick={() => navigate({ to: '/withdraw' })}>
            <CardHeader className="pb-3">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                <ArrowDownCircle className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-lg">{t('withdraw')}</CardTitle>
              <CardDescription>{t('withdrawFunds')}</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
}
