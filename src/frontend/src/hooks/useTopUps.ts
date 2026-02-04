import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { queryKeys } from './queryKeys';
import { invalidateWalletQueries } from './useWallet';
import type { Amount, TopUpRequest, TopUpRequestId } from '../backend';

export function useCreateTopUpRequest() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (amount: Amount) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createTopUpRequest(amount);
    },
  });
}

export function useGetTopUpHistory() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<TopUpRequest[]>({
    queryKey: queryKeys.topUpHistory,
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getTopUpHistory();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetTopUpRequests() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<TopUpRequest[]>({
    queryKey: queryKeys.topUpRequests,
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getTopUpRequests();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useApproveTopUpRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (topUpRequestId: TopUpRequestId) => {
      if (!actor) throw new Error('Actor not available');
      return actor.approveTopUpRequest(topUpRequestId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.topUpRequests });
      queryClient.invalidateQueries({ queryKey: queryKeys.topUpHistory });
      invalidateWalletQueries(queryClient);
    },
  });
}
