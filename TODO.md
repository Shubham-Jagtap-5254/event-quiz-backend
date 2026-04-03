# Spin Progress Persistence Task - TODO

## Steps to Complete:

### 1. Backend Model Update ✅
- Edit `models/Lead.js`: Add `spins_used`, `spin_results` fields.

### 2. Backend Controller Updates ✅
- Edit `controllers/leadController.js`: Add `getLeadByPhoneInterest`, modify `updateLead` for spins, update `createLead`.

### 3. Backend Routes Update ✅
- Edit `routes/leadRoutes.js`: Add GET `/by-phone`.

### 4. Frontend API Update ✅
- Edit `../Event-Quiz/project/src/api.ts`: Add `getLeadByPhoneInterest`.

### 5. Frontend SpinWheel Update ✅
- Edit `../Event-Quiz/project/src/components/SpinWheel.tsx`: Load progress on init, update after each spin, handle complete state.

### 6. Test & Restart ✅
- Backend updated; restart server.
- Frontend fully updated.
- Run `node server.js` (backend).
- Test: Complete interest -> lead form -> OTP -> spin once -> refresh page -> spin wheel shows 2 left + previous score -> complete spins -> refresh shows results.
- Admin panel shows updated best_score/tier/spins_used.

## Progress: 6/6 completed

Updated after each step.

