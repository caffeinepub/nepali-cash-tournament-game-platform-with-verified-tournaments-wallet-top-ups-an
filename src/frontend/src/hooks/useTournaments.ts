import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { invalidateWalletQueries } from './useWallet';
import type { Amount, TournamentId } from '../backend';

export function useCreateTournament() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({ name, entryFee }: { name: string; entryFee: Amount }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createTournament(name, entryFee);
    },
  });
}

export function useVerifyTournament() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (tournamentId: TournamentId) => {
      if (!actor) throw new Error('Actor not available');
      return actor.verifyTournament(tournamentId);
    },
  });
}

export function useJoinTournament() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tournamentId: TournamentId) => {
      if (!actor) throw new Error('Actor not available');
      return actor.joinTournament(tournamentId);
    },
    onSuccess: () => {
      invalidateWalletQueries(queryClient);
    },
  });
}
