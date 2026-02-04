import Map "mo:core/Map";
import Set "mo:core/Set";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import List "mo:core/List";
import Order "mo:core/Order";
import Array "mo:core/Array";
import Int "mo:core/Int";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  // Types
  public type TournamentId = Principal;
  public type WalletTransactionId = Principal;
  public type WithdrawalRequestId = Principal;
  public type TopUpRequestId = Principal;
  public type Amount = { amount : Int };
  public type UserProfile = {
    name : Text;
  };

  public type TournamentStatus = {
    #open;
    #ongoing;
    #finished;
  };

  public type Tournament = {
    id : TournamentId;
    name : Text;
    entryFee : Amount;
    status : TournamentStatus;
    verified : Bool;
    participants : Set.Set<Principal>;
    winner : ?Principal;
  };

  public type WalletTransaction = {
    id : WalletTransactionId;
    userId : Principal;
    amount : Amount;
    createdAt : Int;
    transactionType : {
      #deposit;
      #withdrawal;
      #prize;
      #topUp;
      #withdrawalRequest;
    };
  };

  public type WithdrawalRequest = {
    id : WithdrawalRequestId;
    userId : Principal;
    amount : Amount;
    createdAt : Int;
    status : {
      #pending;
      #approved;
      #completed;
      #rejected;
    };
    paymentProvider : {
      #imePay;
      #khalti;
    };
    payoutIdentifier : Text;
    payoutName : Text;
  };

  public type TopUpRequest = {
    id : TopUpRequestId;
    userId : Principal;
    amount : Amount;
    createdAt : Int;
    status : {
      #pending;
      #completed;
    };
    transactionId : Text;
    paymentProvider : {
      #imePay;
      #khalti;
    };
    payoutIdentifier : Text;
  };

  public type WalletError = {
    #unauthorized;
    #insufficientFunds;
    #tournamentDoesNotExist;
    #tournamentClosed;
    #tournamentNotVerified;
    #participationClosed;
    #withdrawalAmountTooLow;
    #withdrawalAlreadyRequested;
    #withdrawalRequestNotFound;
  };

  // Comparison modules for sorting
  module Tournament {
    public func compare(left : Tournament, right : Tournament) : Order.Order {
      Int.compare(left.entryFee.amount, right.entryFee.amount);
    };
  };

  module WithdrawalRequest {
    public func compare(left : WithdrawalRequest, right : WithdrawalRequest) : Order.Order {
      Int.compare(left.createdAt, right.createdAt);
    };
  };

  module TopUpRequest {
    public func compare(left : TopUpRequest, right : TopUpRequest) : Order.Order {
      Int.compare(left.createdAt, right.createdAt);
    };
  };

  // Initialize authorization state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // State variables
  let userProfiles = Map.empty<Principal, UserProfile>();
  let tournaments = Map.empty<TournamentId, Tournament>();
  let withdrawalRequests = Map.empty<WithdrawalRequestId, WithdrawalRequest>();
  let topUpRequests = Map.empty<TopUpRequestId, TopUpRequest>();
  let walletBalances = Map.empty<Principal, Amount>();
  let walletTransactions = Map.empty<Principal, [WalletTransaction]>();

  // User profile functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Tournament functions
  public shared ({ caller }) func createTournament(name : Text, entryFee : Amount) : async TournamentId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create tournaments");
    };

    let tournamentId = caller;
    let participants = Set.empty<Principal>();
    let tournament : Tournament = {
      id = tournamentId;
      name;
      entryFee;
      status = #open;
      verified = false;
      participants;
      winner = null;
    };
    tournaments.add(tournamentId, tournament);
    tournamentId;
  };

  public shared ({ caller }) func verifyTournament(tournamentId : TournamentId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can verify tournaments");
    };

    switch (tournaments.get(tournamentId)) {
      case (null) { Runtime.trap("Tournament not found") };
      case (?tournament) {
        tournaments.add(
          tournamentId,
          {
            tournament with
            verified = true;
          },
        );
      };
    };
  };

  public shared ({ caller }) func joinTournament(tournamentId : TournamentId) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can join tournaments");
    };

    switch (tournaments.get(tournamentId)) {
      case (null) { Runtime.trap("Tournament not found") };
      case (?tournament) {
        if (not tournament.verified) {
          Runtime.trap("Tournament needs to be verified by an admin first");
        };
        if (tournament.status != #open or tournament.verified != true) {
          Runtime.trap("Tournament cannot be joined anymore");
        };

        switch (walletBalances.get(caller)) {
          case (null) {
            Runtime.trap("User does not have a balance");
          };
          case (?balance) {
            if (balance.amount < tournament.entryFee.amount) {
              Runtime.trap("Not enough credits to join this tournament");
            };
            tournament.participants.add(caller);
            tournaments.add(
              tournamentId,
              tournament,
            );
            walletBalances.add(
              caller,
              {
                balance with
                amount = balance.amount - tournament.entryFee.amount;
              },
            );
          };
        };
        true;
      };
    };
  };

  // Wallet functions
  public query ({ caller }) func getBalance() : async Amount {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view balance");
    };

    switch (walletBalances.get(caller)) {
      case (null) { { amount = 0 } };
      case (?balance) { { amount = balance.amount } };
    };
  };

  public query ({ caller }) func getTransactionHistory() : async [WalletTransaction] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view transaction history");
    };

    switch (walletTransactions.get(caller)) {
      case (null) { [] };
      case (?transactions) { transactions };
    };
  };

  public shared ({ caller }) func createTopUpRequest(amount : Amount) : async TopUpRequestId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create top-up requests");
    };

    let topUpRequestId = caller;
    let topUpRequest = {
      id = topUpRequestId;
      userId = caller;
      amount;
      createdAt = Time.now();
      status = #pending;
      transactionId = "";
      paymentProvider = #imePay;
      payoutIdentifier = "";
    };
    topUpRequests.add(topUpRequestId, topUpRequest);
    topUpRequestId;
  };

  public shared ({ caller }) func approveTopUpRequest(topUpRequestId : TopUpRequestId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can approve top-ups");
    };

    switch (topUpRequests.get(topUpRequestId)) {
      case (null) { Runtime.trap("Top-up request not found") };
      case (?topUpRequest) {
        topUpRequests.add(
          topUpRequestId,
          { topUpRequest with status = #completed },
        );
        let currentBalance = switch (walletBalances.get(topUpRequest.userId)) {
          case (null) { { amount = 0 } };
          case (?balance) { balance };
        };
        let newBalance = { amount = currentBalance.amount + topUpRequest.amount.amount };
        walletBalances.add(topUpRequest.userId, newBalance);
      };
    };
  };

  public query ({ caller }) func getTopUpRequests() : async [TopUpRequest] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all top-up requests");
    };

    topUpRequests.values().toArray().sort();
  };

  public shared ({ caller }) func requestWithdrawal(amount : Amount, provider : { #imePay; #khalti }, identifier : Text, payoutName : Text) : async WithdrawalRequestId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can request withdrawals");
    };

    switch (walletBalances.get(caller)) {
      case (null) { Runtime.trap("User does not have a balance") };
      case (?balance) {
        if (balance.amount < amount.amount) {
          Runtime.trap("Not enough credits to withdraw the requested amount");
        };
        let withdrawalRequestId = caller;
        let withdrawalRequest = {
          id = withdrawalRequestId;
          userId = caller;
          amount;
          createdAt = Time.now();
          status = #pending;
          paymentProvider = provider;
          payoutIdentifier = identifier;
          payoutName;
        };
        withdrawalRequests.add(withdrawalRequestId, withdrawalRequest);
        withdrawalRequestId;
      };
    };
  };

  public shared ({ caller }) func approveWithdrawalRequest(withdrawalRequestId : WithdrawalRequestId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can approve withdrawals");
    };

    switch (withdrawalRequests.get(withdrawalRequestId)) {
      case (null) { Runtime.trap("Withdrawal request not found") };
      case (?withdrawalRequest) {
        withdrawalRequests.add(
          withdrawalRequestId,
          {
            withdrawalRequest with
            status = #approved;
          },
        );
      };
    };
  };

  public shared ({ caller }) func markWithdrawalRequestCompleted(withdrawalRequestId : WithdrawalRequestId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can mark withdrawals as completed");
    };

    switch (withdrawalRequests.get(withdrawalRequestId)) {
      case (null) { Runtime.trap("Withdrawal request not found") };
      case (?request) {
        withdrawalRequests.add(withdrawalRequestId, { request with status = #completed });
      };
    };
  };

  public query ({ caller }) func getWithdrawalRequests() : async [WithdrawalRequest] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all withdrawal requests");
    };

    withdrawalRequests.values().toArray().sort();
  };

  public query ({ caller }) func getTopUpHistory() : async [TopUpRequest] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view top-up history");
    };

    topUpRequests.values().toArray().sort();
  };
};
