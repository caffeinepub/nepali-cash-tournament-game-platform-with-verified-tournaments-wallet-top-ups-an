import { useState } from 'react';
import { useVerifyTournament } from '../../hooks/useTournaments';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle } from 'lucide-react';
import { t } from '../../i18n';
import { toast } from 'sonner';

export default function VerifyTournamentPanel() {
  const [tournamentId, setTournamentId] = useState('');
  const verifyTournament = useVerifyTournament();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tournamentId.trim()) return;

    try {
      await verifyTournament.mutateAsync(tournamentId.trim() as any);
      toast.success(t('tournamentVerified'));
      setTournamentId('');
    } catch (error) {
      toast.error(t('error'));
    }
  };

  return (
    <Card className="border-2">
      <CardHeader>
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">
            <CheckCircle className="h-7 w-7 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl">{t('verifyTournament')}</CardTitle>
            <CardDescription>प्रतियोगिता प्रमाणित गर्नुहोस्</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tournamentId" className="text-base font-medium">{t('verifyTournamentId')}</Label>
            <Input
              id="tournamentId"
              value={tournamentId}
              onChange={(e) => setTournamentId(e.target.value)}
              placeholder={t('tournamentId')}
              required
              className="h-11"
            />
          </div>

          <Button type="submit" disabled={verifyTournament.isPending} className="w-full h-11">
            {verifyTournament.isPending ? t('verifying') : t('verify')}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
