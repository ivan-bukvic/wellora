

## Plan: Make Historical Data Always Visible

The demo dataset covers January 1–21, 2026. All dashboard cards, the activities page, and the calendar hardcode date ranges relative to "today," so they appear empty when no recent data exists.

### Strategy

Instead of removing time-based logic (which would break the semantic meaning of "weekly rhythm" or "monthly goals"), we add **smart fallback**: detect when the current time window has no data, then shift the window to the most recent period that does have data.

### Changes

#### 1. New utility: find the most recent data window
**File: `src/hooks/useLatestDataRange.tsx`** (new)

A small hook that queries the user's most recent `activity_log` date (`order by date desc limit 1`). Returns `{ latestDate, latestWeekDates, latestMonthStart }` so all components can fall back to the correct period. Single query, shared via React context or called independently.

#### 2. Dashboard — WeeklyRhythmChart
**File: `src/components/dashboard/WeeklyRhythmChart.tsx`**

- After fetching current-week data, if all logs are empty, re-fetch using the week containing `latestDate` from the hook.
- Update the day labels to reflect the actual week shown.
- Add a subtle label like "Week of Jan 13" when showing historical data.

#### 3. Dashboard — WeeklyRhythmStrips  
**File: `src/components/dashboard/WeeklyRhythmStrips.tsx`**

- Same pattern: fall back to the week containing the latest data if current week is empty.

#### 4. Dashboard — TotalActivityCard
**File: `src/components/dashboard/TotalActivityCard.tsx`**

- Change the 7-day window: if no completed logs in the last 7 days, query the 7 days ending at `latestDate`.

#### 5. Dashboard — RecentPatternsCard
**File: `src/components/dashboard/RecentPatternsCard.tsx`**

- Same fallback: use the 7 days ending at the most recent log date.

#### 6. Dashboard — MonthlyGoalsCard
**File: `src/components/dashboard/MonthlyGoalsCard.tsx`**

- If current month has no data, use the month containing `latestDate`.

#### 7. Dashboard — useAIInsights
**File: `src/hooks/useAIInsights.tsx`**

- Fall back to the 7 days ending at the latest log date when recent data is empty.

#### 8. Activities — todayRoutine fallback
**File: `src/hooks/useActivityLogs.tsx`**

- In `todayRoutine` memo: if no logs exist for today, use the most recent date that has logs (from `groupedLogs[0].date`). Return that data instead, adding a `routineDate` field to indicate which date is shown.

#### 9. Activities — DailyFlowTimeline
**File: `src/components/sections/DailyFlowTimeline.tsx`**

- If `.eq('date', today)` returns no rows, do a second query: fetch logs for the most recent date (`order by date desc limit 5`).
- Update the header to show "Last recorded: Jan 18" instead of "Today's Flow" when showing historical data.

#### 10. Activities — ActivitiesContent
**File: `src/components/sections/ActivitiesContent.tsx`**

- Use the new `routineDate` from the hook. When showing fallback data, change the heading from "Today's Routine" to "Last Recorded Activity · Jan 18".

#### 11. Calendar — auto-navigate to data
**File: `src/components/sections/CalendarContent.tsx`**

- On mount, if the current month has no data in `calendarData`, set `currentDate` to the month of `latestDate` (e.g., January 2026).

### Technical details

- **`useLatestDataRange` hook** performs one lightweight query: `select date from activity_logs where user_id = $uid order by date desc limit 1`. From the returned date, it computes the fallback week (Mon–Sun) and fallback month start.
- Each dashboard card will first attempt its normal query. If results are empty, it re-queries using the fallback range. This avoids changing behavior when the user does have current data.
- No styling, layout, or auth changes.
- No backend query changes.

