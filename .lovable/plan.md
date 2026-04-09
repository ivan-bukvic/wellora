

## Fix Monthly Goals: Align target scaling with data

### Problem
Targets in `goalConfig` are **weekly** (e.g. Sleep 56 hrs = 8 hrs/day × 7). But data spans 21 days. Currently targets aren't scaled at all, so 21 days of actuals are compared against 7-day targets — making everything look 3x over target.

### Actual data (21 days, Jan 1–21)
| Activity | Actual | Current target | % shown |
|---|---|---|---|
| Sleep | 157 hrs | 56 hrs | 280% ← wrong |
| Water | 142 glasses | 56 | 253% |
| Mindfulness | 237 min | 70 min | 339% |
| Stretching | 12 sessions | 7 | 171% |
| Walking | 531 min | 210 min | 253% |

### Fix: scale weekly targets by number of weeks in data range

Since targets are weekly-based, multiply each by `actualDays / 7`:

For 21 days: scale = 3 → Sleep target = 168, Water = 168, etc.

| Activity | Actual | Scaled target | % |
|---|---|---|---|
| Sleep | 157 hrs | 168 hrs | 93% ✓ |
| Water | 142 | 168 | 85% ✓ |
| Mindfulness | 237 min | 210 min | 113% ✓ |
| Stretching | 12 | 21 | 57% ✓ |
| Walking | 531 min | 630 min | 84% ✓ |

### Changes — `src/components/dashboard/MonthlyGoalsCard.tsx`

1. **Update `computeGoals` signature** to accept `actualDays: number`
2. **Scale targets**: `adjustedTarget = Math.round(goal.target * (actualDays / 7))`
3. **After fetching logs**, compute `actualDays` from min/max `log.date` (+1), pass to `computeGoals`
4. **Add debug logs**:
   - `console.log('Actual data range:', earliestDate, '→', latestDate, '=', actualDays, 'days')`
   - `console.log('Adjusted goals:', computed.map(g => ({ label: g.label, current: g.current, target: g.target })))`
5. **Display subtitle** showing the data range (e.g. "Jan 1–21") so the user knows targets are scaled

No other files changed.

