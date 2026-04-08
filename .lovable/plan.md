
Goal: make every data fetch run only after auth is ready, so fallback logic can actually execute and debug logs always appear.

What I found:
- `UserProfileContext` already owns the real auth state (`session`, `authLoading`).
- `useLatestDataRange`, `useActivityLogs`, and `DailyFlowTimeline` still create their own auth listeners or call `getUser()` locally.
- Several dashboard fetchers (`useAIInsights`, `WeeklyRhythmChart`, `WeeklyRhythmStrips`, `TotalActivityCard`, `RecentPatternsCard`, `MonthlyGoalsCard`) only depend on `rangeLoading`/`latestDate`, then call `supabase.auth.getUser()` inside the effect. If auth is not restored yet, they return once and may never retry at the right time.
- That explains the current symptom: no reliable fetch after login, so no logs and empty UI.

Implementation plan

1. Standardize auth dependency
- Update every data-fetching hook/component to read `session` and `authLoading` from `useUserProfile()`.
- Stop using local `onAuthStateChange` / `getUser()` for these fetches.
- Keep authentication logic untouched; only consume the existing shared auth state.

2. Fix core hooks first
- `src/hooks/useLatestDataRange.tsx`
  - Add `console.log('[DEBUG] useLatestDataRange hook initialized')` at top.
  - Replace local `userId` auth listener logic with `const { session, authLoading } = useUserProfile()`.
  - Move fetch into `fetchLatestData()` and run it from:
    `useEffect(() => { if (authLoading || !session?.user) return; fetchLatestData(); }, [session, authLoading])`
  - Log before querying, and log query results / empty-result reason.
- `src/hooks/useActivityLogs.tsx`
  - Same pattern: use shared `session`, not local auth state.
  - Trigger fetch from `[session, authLoading, startDateStr, endDateStr]`.
  - Add guaranteed top-level debug log plus logs inside fetch.
  - Ensure logs still sort newest first and existing fallback display behavior remains.

3. Fix component-level fetchers that currently race auth
- Update these files to use `useUserProfile()` and rerun fetches when `session` becomes available:
  - `src/hooks/useAIInsights.tsx`
  - `src/components/sections/DailyFlowTimeline.tsx`
  - `src/components/dashboard/WeeklyRhythmChart.tsx`
  - `src/components/dashboard/WeeklyRhythmStrips.tsx`
  - `src/components/dashboard/TotalActivityCard.tsx`
  - `src/components/dashboard/RecentPatternsCard.tsx`
  - `src/components/dashboard/MonthlyGoalsCard.tsx`
- Each effect should follow the same pattern:
  - log initialization
  - `if (authLoading) return`
  - `if (!session?.user) { log no session; set non-loading state if needed; return }`
  - call fetch function
- Effect deps should include `session`, `authLoading`, plus existing date-range inputs (`latestDate`, `latestMonthStart`, `rangeLoading`, etc.).

4. Make debug logs guaranteed
- Move all debug logs above early returns so they always fire when the hook/component runs.
- Add logs for:
  - hook/component initialized
  - auth state seen (`authLoading`, `session?.user?.id`)
  - fetch started
  - query returned row count / empty result
  - query error

5. Clean up the temporary Activities debug probe
- `src/components/sections/ActivitiesContent.tsx`
  - Change the temporary raw debug effect to also depend on shared `session`/`authLoading`, so it runs after login.
  - Keep it temporary for diagnosis, or remove it once the main hooks are confirmed working.

6. Preserve existing UI behavior
- No styling/layout changes.
- No auth flow changes.
- No backend/schema changes.
- Fallback behavior remains the same; this fix only makes the fetches actually execute at the right time.

Technical notes
- Main rule to apply everywhere:
  `useEffect(() => { if (authLoading || !session?.user) return; fetchData(); }, [session, authLoading, ...otherDeps])`
- `CalendarContent` should not need special auth work once `useLatestDataRange` and `useActivityLogs` are fixed, because it already depends on those hooks.
- This is a frontend timing fix, not a table/RLS redesign.

Expected result after implementation
- Debug logs appear consistently after login.
- `useLatestDataRange` resolves a real `latestDate` whenever the user has historical logs.
- Dashboard, Activities, and Calendar fallback logic finally runs using historical data instead of staying empty.
