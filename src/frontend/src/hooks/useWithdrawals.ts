import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { queryKeys } from './queryKeys';
import { invalidateWalletQueries } from './useWallet';
import type { Amount, WithdrawalRequest, WithdrawalRequestId, Variant_imePay_khalti } from '../backend';

export function useRequestWithdrawal() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({
      amount,
      provider,
      identifier,
      payoutName,
    }: {
      amount: Amount;
      provider: Variant_imePay_khalti;
      identifier: string;
      payoutName: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.requestWithdrawal(amount, provider, identifier, payoutName);
    },
  });
}

export function useGetWithdrawalRequests() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<WithdrawalRequest[]>({
    queryKey: queryKeys.withdrawalRequests,
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getWithdrawalRequests();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useApproveWithdrawalRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (withdrawalRequestId: WithdrawalRequestId) => {
      if (!actor) throw new Error('Actor not available');
      return actor.approveWithdrawalRequest(withdrawalRequestId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.withdrawalRequests });
      invalidateWalletQueries(queryClient);
    },
  });
}

export function useMarkWithdrawalRequestCompleted() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (withdrawalRequestId: WithdrawalRequestId) => {
      if (!actor) throw new Error('Actor not available');
      return actor.markWithdrawalRequestCompleted(withdrawalRequestId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.withdrawalRequests });
    },
  });
}
