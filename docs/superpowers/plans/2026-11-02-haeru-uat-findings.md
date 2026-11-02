# Haeru UAT Findings — 2026-11-02

Live: https://haeru.165-22-211-20.sslip.io · App `running:healthy`

## Auth API (all PASS)

| Role | Email | Result |
|---|---|---|
| Owner | director@wsh.bt | Karma Dechen · WSH |
| Facilitator | facilitator@wsh.bt | Kuenzang Tshomo · room=kg |
| Parent | parent@wsh.bt | Deki · childIds=[Kinley UUID] |
| Caregiver | caregiver@wsh.bt | Dawa Zam · same child |
| Superadmin | superadmin@haeru.bt | Haeru Ops |

Live progress for Kinley: Approaches to learning **ap=1** from Voice AI milestone ✓

---

## P0 — Must fix now (blocks real-world use)

1. **Mobile app has no navigation** — `NavigationSidebar` is `hidden md:flex`; HeaderTopBar has no menu. Phones cannot switch screens after login.
2. **Owner Children directory is still mock `CHILDREN`** — cannot open live Kinley UUID from staff UI; Admissions/API children invisible.
3. **`TodayDashboard` greets “Good morning, Choki”** — hardcoded; should use `currentUser.name`.
4. **Facilitator DailyCareLogger / PhotoStaging** still filter mock `CHILDREN` (nursery), not live kg roster.
5. **CaregiverHome + ELDSRadarView** still bind to mock `PARENT_CHILD_ID` (`c1`), not session child UUID → profile/progress break for caregiver/parent radar screens.
6. **Landing marketing demo** still says Tr. Sonam / Director Choki (Voice demo + story hero) — confuses pilot users.

## P1 — Should fix this sprint

7. **Classroom/center feeds** still use in-memory pulse store + mock child ids for facilitator room filter.
8. **Owner fees/invoices UIs** largely mock amounts (known slice debt).
9. **No mobile logout** without sidebar.
10. **Deploy lag** — production CDN/cache may still show pre-chibi Haeru until new build healthy.
11. **GEMINI_API_KEY empty** — Voice AI uses heuristic extract (wrong “Boris” transcriptions); need Gemini for better ELDS.
12. **Parent Telegram pairing** unused — delivered moments don’t ping Deki on Telegram until `pair_wsh_deki`.

## P2 — Upgrade / add later

13. Wire admissions → live children gallery refresh.
14. Persist pickup logs from UI.
15. Confirm ELDS checklist rows create Director queue items UI.
16. Replace remaining enterprise.ts demo authors (Kuenga / Sonam Y.).
17. Mobile bottom nav for parent (Home / Profile / Photos / Progress).

---

## Execute order

1. Mobile drawer nav (reuse sidebar items + logout)
2. Live `ChildrenDirectory` from `/api/children`
3. Fix Choki greeting + marketing demo names → Karma / Kuenzang
4. Live roster for DailyCareLogger + PhotoStaging + CaregiverHome + ELDSRadarView
5. Build + deploy + re-UAT parent/owner/facilitator in browser
