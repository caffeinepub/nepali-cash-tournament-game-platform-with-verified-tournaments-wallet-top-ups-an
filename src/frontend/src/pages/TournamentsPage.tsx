import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { getTournamentIds, addTournamentId } from '../lib/tournamentStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trophy, Plus } from 'lucide-react';
import { t } from '../i18n';
import { toast } from 'sonner';

export default function TournamentsPage() {
  const navigate = useNavigate();
  const [tournamentIds, setTournamentIds] = useState<string[]>(getTournamentIds());
  const [newId, setNewId] = useState('');

  const handleAddTournament = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newId.trim()) return;

    try {
      addTournamentId(newId.trim());
      setTournamentIds(getTournamentIds());
      setNewId('');
      toast.success(t('success'));
    } catch (error) {
      toast.error(t('error'));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">{t('allTournaments')}</h1>
        <p className="text-muted-foreground">प्रतियोगितामा सामेल हुनुहोस् र पुरस्कार जित्नुहोस्</p>
      </div>

      {/* Add Tournament ID */}
      <Card>
        <CardHeader>
          <CardTitle>{t('addTournamentId')}</CardTitle>
          <CardDescription>प्रतियोगिता हेर्न ID थप्नुहोस्</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddTournament} className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="tournamentId" className="sr-only">{t('tournamentId')}</Label>
              <Input
                id="tournamentId"
                value={newId}
                onChange={(e) => setNewId(e.target.value)}
                placeholder={t('tournamentId')}
              />
            </div>
            <Button type="submit">
              <Plus className="h-4 w-4 mr-2" />
              {t('addTournament')}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Tournament List */}
      {tournamentIds.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Trophy className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">{t('noTournaments')}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tournamentIds.map((id) => (
            <Card key={id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-primary" />
                  प्रतियोगिता
                </CardTitle>
                <CardDescription className="font-mono text-xs truncate">{id}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => navigate({ to: '/tournaments/$tournamentId', params: { tournamentId: id } })}
                  className="w-full"
                >
                  विवरण हेर्नुहोस्
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
