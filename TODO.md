# MongoDB Atlas IP Whitelist Permanent Fix - TODO Steps

## 1. Atlas Dashboard (Manual, One-time)
- [ ] Login: https://cloud.mongodb.com
- [ ] Select your project/cluster
- [ ] Sidebar → Security → Network Access (or Access Manager)
- [ ] Click 'Add IP Address' → 'Allow Access from Anywhere' (0.0.0.0/0) → Confirm
- [ ] Wait 1-2 min for propagation

## 2. Code Updates ✅
- ✅ Update config/database.js (retry logic, no crash)
- ✅ Update app.js (graceful start)

## 3. Test
- [ ] npm run dev (server starts, DB connects/retires)
- [ ] curl http://localhost:5000/api/leads (works post-connect)
- [ ] Check logs: 'MongoDB Atlas Connected...'

## Notes
- 0.0.0.0/0 allows any IP (dev-safe; prod: restrict/VPC)
- If Atlas menu missing: cluster paused? Free tier limits? Browser cache clear.

Status: Starting code updates...
