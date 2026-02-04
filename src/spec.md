# Specification

## Summary
**Goal:** Build a Nepali-localized cash-tournament platform on ICP with verified tournaments, an in-app wallet, and admin-reviewed top-ups and withdrawals (IME Pay/Khalti).

**Planned changes:**
- Add Internet Identity login/logout, associate all data to caller principal, and implement basic roles (user vs admin) with admin-only protected actions.
- Implement tournaments with lifecycle states (Draft/Unverified, Verified/Open, In Progress, Completed), admin verification, user joining (verified/open only), entry fee charging from wallet, result finalization, and prize distribution to winners’ wallets with audit timestamps.
- Add an in-app wallet per user with balance plus transaction history (topup/entry_fee/prize/withdrawal), and ensure all mutations occur in backend methods.
- Add top-up requests: users submit amount/note; admins approve/reject; approval credits wallet and records a transaction; users can view request status.
- Add withdrawal requests: users request amount, choose IME Pay or Khalti, provide payout identifier and optional note; backend enforces available balance and prevents double-spend via reservation/deduction; admins approve/reject/mark completed; users can track statuses.
- Create core screens and responsive navigation: Dashboard, Tournaments list/detail/join, Wallet (balance + transactions), Top-up, Withdraw (request + list), and Admin area (verification, results, approvals), wired via actor hook pattern and React Query.
- Localize UI to Nepali by default with centralized strings across all primary flows.
- Apply a consistent UI theme (components, spacing, typography) with a non-blue, non-purple primary palette.
- Add and reference generated static assets (logo + hero background) from `frontend/public/assets/generated`.

**User-visible outcome:** Users can sign in with Internet Identity, browse/join verified tournaments using wallet funds, view wallet/transactions, request top-ups and withdrawals (IME Pay/Khalti) and track statuses; admins can verify tournaments, approve top-ups/withdrawals, and finalize results to distribute prizes—all in Nepali UI.
