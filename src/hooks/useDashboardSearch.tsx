import { useState, useEffect, useMemo, useCallback } from 'react';

// Searchable content definitions for each dashboard card
export const SEARCHABLE_CONTENT = {
  aiInsight: {
    id: 'aiInsight',
    staticText: ['Weekly Reflection', 'Gentle reflections based on your recent activity'],
    // Dynamic text will be merged at runtime from useAIInsights
  },
  totalActivity: {
    id: 'totalActivity',
    staticText: [
      'Your Week at a Glance',
      'Weekly Consistency',
      'Routine Balance',
      'Movement',
      'Rest',
      'Mindfulness',
      'You stayed consistent on most days this week',
      'Good balance between movement, rest, and mindfulness',
    ],
  },
  weeklyRhythmChart: {
    id: 'weeklyRhythmChart',
    staticText: [
      'Activity vs Rest Balance',
      'A relative snapshot, not a performance score',
      'Activity',
      'Rest',
    ],
  },
  chartInsight: {
    id: 'chartInsight',
    staticText: [
      'What we noticed',
      'Designed to support reflection, not optimization',
    ],
    // Dynamic text will be merged at runtime from useAIInsights
  },
  weeklyRhythmStrips: {
    id: 'weeklyRhythmStrips',
    staticText: [
      'Your weekly rhythm',
      'A gentle view of how your habits showed up',
      'Walking',
      'Sleep',
      'Hydration',
      'Stretching',
      'Mindfulness',
    ],
  },
  recentPatterns: {
    id: 'recentPatterns',
    staticText: [
      'Recent patterns',
      'Sleep has been more consistent',
      'Hydration improved slightly',
      'Mindfulness stayed light but regular',
    ],
  },
  monthlyGoals: {
    id: 'monthlyGoals',
    staticText: [
      'Your Monthly Goals',
      'Sleep',
      'Drink Water',
      'Mindfulness',
      'Stretching',
      'Daily Steps',
    ],
  },
};

export type CardId = keyof typeof SEARCHABLE_CONTENT;

interface DashboardSearchResult {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  debouncedQuery: string;
  clearSearch: () => void;
  visibleCards: Set<CardId>;
  hasNoMatches: boolean;
  isSearching: boolean;
}

// Custom debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function useDashboardSearch(dynamicContent?: Record<CardId, string[]>): DashboardSearchResult {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebounce(searchQuery.trim(), 250);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  const visibleCards = useMemo(() => {
    const visible = new Set<CardId>();
    const query = debouncedQuery.toLowerCase();

    if (!query) {
      // Show all cards when no search
      Object.keys(SEARCHABLE_CONTENT).forEach((key) => {
        visible.add(key as CardId);
      });
      return visible;
    }

    // Check each card's searchable content
    Object.entries(SEARCHABLE_CONTENT).forEach(([cardId, content]) => {
      const allText = [
        ...content.staticText,
        ...(dynamicContent?.[cardId as CardId] || []),
      ];

      const hasMatch = allText.some((text) =>
        text.toLowerCase().includes(query)
      );

      if (hasMatch) {
        visible.add(cardId as CardId);
      }
    });

    return visible;
  }, [debouncedQuery, dynamicContent]);

  const hasNoMatches = debouncedQuery.length > 0 && visibleCards.size === 0;
  const isSearching = searchQuery.length > 0;

  return {
    searchQuery,
    setSearchQuery,
    debouncedQuery,
    clearSearch,
    visibleCards,
    hasNoMatches,
    isSearching,
  };
}
