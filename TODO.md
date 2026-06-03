# TODO

- [x] Add missing `POST /api/leads/reset-tiers` endpoint implementation.
- [x] Wire route in `routes/leadRoutes.js`.
- [x] Implement reset logic in `controllers/leadController.js` (reset winners: best_score/tier/spins_used/spin_results).
- [x] (Client) Verify `leadsApi.resetAllTiers()` points to correct endpoint.
- [x] Run server locally and hit endpoint to confirm it returns 200.
- [ ] Redeploy backend to Render so the new route is live (was returning 404 before).



