import { useState } from 'react';
import { useCreateTournament } from '../../hooks/useTournaments';
import { addTournamentId } from '../../lib/tournamentStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trophy } from 'lucide-react';
import { t } from '../../i18n';
import { toast } from 'sonner';

export default function CreateTournamentPanel() {
  const [name, setName] = useState('');
  const [entryFee, setEntryFee] = useState('');
  const createTournament = useCreateTournament();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const feeNum = parseInt(entryFee);
    if (isNaN(feeNum) || feeNum < 0) {
      toast.error('कृपया मान्य प्रवेश शुल्क प्रविष्ट गर्नुहोस्');
      return;
    }

    try {
      const tournamentId = await createTournament.mutateAsync({
        name: name.trim(),
        entryFee: { amount: BigInt(feeNum) },
      });
      addTournamentId(tournamentId.toString());
      toast.success(t('tournamentCreated'));
      setName('');
      setEntryFee('');
    } catch (error) {
      toast.error(t('error'));
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Trophy className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle>{t('createTournament')}</CardTitle>
            <CardDescription>नयाँ प्रतियोगिता सिर्जना गर्नुहोस्</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t('tournamentName')}</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('tournamentNamePlaceholder')}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="entryFee">{t('entryFee')}</Label>
            <Input
              id="entryFee"
              type="number"
              value={entryFee}
              onChange={(e) => setEntryFee(e.target.value)}
              placeholder="0"
              min="0"
              required
            />
          </div>

          <Button type="submit" disabled={createTournament.isPending} className="w-full">
            {createTournament.isPending ? t('creating') : t('submit')}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
