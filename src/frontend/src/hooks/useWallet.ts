import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { queryKeys } from './queryKeys';
import type { Amount, WalletTransaction } from '../backend';

export function useGetBalance() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Amount>({
    queryKey: queryKeys.balance,
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getBalance();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetTransactionHistory() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<WalletTransaction[]>({
    queryKey: queryKeys.transactions,
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getTransactionHistory();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function invalidateWalletQueries(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: queryKeys.balance });
  queryClient.invalidateQueries({ queryKey: queryKeys.transactions });
}
