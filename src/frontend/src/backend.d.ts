import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Amount {
    amount: bigint;
}
export type WithdrawalRequestId = Principal;
export type TopUpRequestId = Principal;
export interface WalletTransaction {
    id: WalletTransactionId;
    transactionType: Variant_withdrawalRequest_topUp_deposit_withdrawal_prize;
    userId: Principal;
    createdAt: bigint;
    amount: Amount;
}
export interface WithdrawalRequest {
    id: WithdrawalRequestId;
    status: Variant_pending_completed_approved_rejected;
    payoutIdentifier: string;
    userId: Principal;
    createdAt: bigint;
    amount: Amount;
    payoutName: string;
    paymentProvider: Variant_imePay_khalti;
}
export interface TopUpRequest {
    id: TopUpRequestId;
    status: Variant_pending_completed;
    payoutIdentifier: string;
    userId: Principal;
    createdAt: bigint;
    amount: Amount;
    paymentProvider: Variant_imePay_khalti;
    transactionId: string;
}
export type WalletTransactionId = Principal;
export interface UserProfile {
    name: string;
}
export type TournamentId = Principal;
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum Variant_imePay_khalti {
    imePay = "imePay",
    khalti = "khalti"
}
export enum Variant_pending_completed {
    pending = "pending",
    completed = "completed"
}
export enum Variant_pending_completed_approved_rejected {
    pending = "pending",
    completed = "completed",
    approved = "approved",
    rejected = "rejected"
}
export enum Variant_withdrawalRequest_topUp_deposit_withdrawal_prize {
    withdrawalRequest = "withdrawalRequest",
    topUp = "topUp",
    deposit = "deposit",
    withdrawal = "withdrawal",
    prize = "prize"
}
export interface backendInterface {
    approveTopUpRequest(topUpRequestId: TopUpRequestId): Promise<void>;
    approveWithdrawalRequest(withdrawalRequestId: WithdrawalRequestId): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createTopUpRequest(amount: Amount): Promise<TopUpRequestId>;
    createTournament(name: string, entryFee: Amount): Promise<TournamentId>;
    getBalance(): Promise<Amount>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getTopUpHistory(): Promise<Array<TopUpRequest>>;
    getTopUpRequests(): Promise<Array<TopUpRequest>>;
    getTransactionHistory(): Promise<Array<WalletTransaction>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getWithdrawalRequests(): Promise<Array<WithdrawalRequest>>;
    isCallerAdmin(): Promise<boolean>;
    joinTournament(tournamentId: TournamentId): Promise<boolean>;
    markWithdrawalRequestCompleted(withdrawalRequestId: WithdrawalRequestId): Promise<void>;
    requestWithdrawal(amount: Amount, provider: Variant_imePay_khalti, identifier: string, payoutName: string): Promise<WithdrawalRequestId>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    verifyTournament(tournamentId: TournamentId): Promise<void>;
}
