import { useParams } from '@tanstack/react-router';
import { useJoinTournament } from '../hooks/useTournaments';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy } from 'lucide-react';
import { t } from '../i18n';
import { toast } from 'sonner';
import { mapErrorToNepali } from '../utils/errorMapping';

export default function TournamentDetailPage() {
  const { tournamentId } = useParams({ from: '/tournaments/$tournamentId' });
  const joinTournament = useJoinTournament();

  const handleJoin = async () => {
    try {
      await joinTournament.mutateAsync(tournamentId as any);
      toast.success(t('tournamentJoined'));
    } catch (error) {
      toast.error(mapErrorToNepali(error));
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">{t('tournamentDetails')}</h1>
        <p className="text-muted-foreground">प्रतियोगिता जानकारी र सामेल हुने विकल्प</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Trophy className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle>प्रतियोगिता</CardTitle>
              <CardDescription className="font-mono text-xs">{tournamentId}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-1">{t('tournamentId')}</p>
            <p className="font-mono text-sm break-all">{tournamentId}</p>
          </div>

          <Button
            onClick={handleJoin}
            disabled={joinTournament.isPending}
            className="w-full"
            size="lg"
          >
            {joinTournament.isPending ? t('joining') : t('joinTournament')}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            प्रतियोगितामा सामेल हुनको लागि तपाईंको वालेटमा पर्याप्त रकम हुनुपर्छ
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
