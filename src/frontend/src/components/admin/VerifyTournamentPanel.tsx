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
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <CheckCircle className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle>{t('verifyTournament')}</CardTitle>
            <CardDescription>प्रतियोगिता प्रमाणित गर्नुहोस्</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tournamentId">{t('verifyTournamentId')}</Label>
            <Input
              id="tournamentId"
              value={tournamentId}
              onChange={(e) => setTournamentId(e.target.value)}
              placeholder={t('tournamentId')}
              required
            />
          </div>

          <Button type="submit" disabled={verifyTournament.isPending} className="w-full">
            {verifyTournament.isPending ? t('verifying') : t('verify')}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
