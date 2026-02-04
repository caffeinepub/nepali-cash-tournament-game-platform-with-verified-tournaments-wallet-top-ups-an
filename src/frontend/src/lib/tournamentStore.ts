const STORAGE_KEY = 'tournament_ids';

export function getTournamentIds(): string[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function addTournamentId(id: string): void {
  try {
    const ids = getTournamentIds();
    if (!ids.includes(id)) {
      ids.push(id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    }
  } catch (error) {
    console.error('Failed to add tournament ID:', error);
  }
}

export function removeTournamentId(id: string): void {
  try {
    const ids = getTournamentIds();
    const filtered = ids.filter((tid) => tid !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Failed to remove tournament ID:', error);
  }
}
