import AdminGuard from '../components/auth/AdminGuard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CreateTournamentPanel from '../components/admin/CreateTournamentPanel';
import VerifyTournamentPanel from '../components/admin/VerifyTournamentPanel';
import TopUpRequestsPanel from '../components/admin/TopUpRequestsPanel';
import WithdrawalRequestsPanel from '../components/admin/WithdrawalRequestsPanel';
import { t } from '../i18n';

export default function AdminPage() {
  return (
    <AdminGuard>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2 tracking-tight">{t('adminPanel')}</h1>
          <p className="text-muted-foreground">प्रशासक उपकरणहरू र सेटिङहरू</p>
        </div>

        <Tabs defaultValue="tournaments" className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-12">
            <TabsTrigger value="tournaments" className="text-sm font-medium">प्रतियोगिताहरू</TabsTrigger>
            <TabsTrigger value="verify" className="text-sm font-medium">प्रमाणित गर्नुहोस्</TabsTrigger>
            <TabsTrigger value="topups" className="text-sm font-medium">टप अप</TabsTrigger>
            <TabsTrigger value="withdrawals" className="text-sm font-medium">निकासी</TabsTrigger>
          </TabsList>

          <TabsContent value="tournaments" className="space-y-4 mt-6">
            <CreateTournamentPanel />
          </TabsContent>

          <TabsContent value="verify" className="space-y-4 mt-6">
            <VerifyTournamentPanel />
          </TabsContent>

          <TabsContent value="topups" className="space-y-4 mt-6">
            <TopUpRequestsPanel />
          </TabsContent>

          <TabsContent value="withdrawals" className="space-y-4 mt-6">
            <WithdrawalRequestsPanel />
          </TabsContent>
        </Tabs>
      </div>
    </AdminGuard>
  );
}
