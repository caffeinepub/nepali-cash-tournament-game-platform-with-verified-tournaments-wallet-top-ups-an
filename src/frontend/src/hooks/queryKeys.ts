export const queryKeys = {
  actor: ['actor'],
  userProfile: ['currentUserProfile'],
  userRole: ['currentUserRole'],
  isAdmin: ['isAdmin'],
  balance: ['balance'],
  transactions: ['transactions'],
  topUpRequests: ['topUpRequests'],
  topUpHistory: ['topUpHistory'],
  withdrawalRequests: ['withdrawalRequests'],
  tournament: (id: string) => ['tournament', id],
};
