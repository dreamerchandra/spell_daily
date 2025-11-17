import { useState, useEffect, useCallback } from 'react';
import { getFollowUps, createFollowUp, type FollowUp } from '../api/follow-ups';

interface UseFollowUpsProps {
  parentId: string;
  apiKey: string;
  adminName?: string;
  limit?: number;
}

interface GroupedFollowUps {
  date: string;
  items: FollowUp[];
}

export const useFollowUps = ({
  parentId,
  apiKey,
  adminName = 'You',
  limit = 20,
}: UseFollowUpsProps) => {
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [groupedFollowUps, setGroupedFollowUps] = useState<GroupedFollowUps[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Group follow-ups by date
  const groupByDate = useCallback((items: FollowUp[]): GroupedFollowUps[] => {
    const groups: { [key: string]: FollowUp[] } = {};

    items.forEach(item => {
      const dateKey = item.date.toDateString();
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(item);
    });

    // Sort groups by date (most recent first) and sort items within each group (most recent first)
    // This maintains the reverse chronological order for pagination
    return Object.entries(groups)
      .map(([date, items]) => ({
        date,
        items: items.sort((a, b) => b.date.getTime() - a.date.getTime()),
      }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, []);

  // Load follow-ups for a specific page
  const loadFollowUps = useCallback(
    async (page: number, append = false) => {
      try {
        setLoading(true);
        setError(null);

        const response = await getFollowUps(parentId, page, limit, apiKey);

        setCurrentPage(response.page.currentPage);
        setTotalPages(Math.ceil(response.page.total / response.page.limit));
        setHasMore(
          response.page.currentPage <
            Math.ceil(response.page.total / response.page.limit)
        );

        if (append) {
          setFollowUps(prev => [...prev, ...response.data]);
        } else {
          setFollowUps(response.data);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load follow-ups'
        );
      } finally {
        setLoading(false);
      }
    },
    [parentId, apiKey, limit]
  );

  // Load more follow-ups (for infinite scroll)
  const loadMore = useCallback(() => {
    loadFollowUps(currentPage + 1, true);
  }, [currentPage, loadFollowUps]);

  // Add new follow-up
  const addFollowUp = useCallback(
    async (text: string) => {
      try {
        setError(null);
        await createFollowUp(parentId, text, apiKey);

        // Create new follow-up object with current date
        const newFollowUp: FollowUp = {
          text,
          date: new Date(),
          adminName: adminName,
        };

        // Add to the beginning of the list (most recent)
        setFollowUps(prev => [newFollowUp, ...prev]);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to create follow-up'
        );
        throw err;
      }
    },
    [parentId, apiKey, adminName]
  );

  // Refresh follow-ups
  const refresh = useCallback(() => {
    setCurrentPage(1);
    setFollowUps([]);
    loadFollowUps(1);
  }, [loadFollowUps]);

  // Update grouped follow-ups whenever followUps changes
  useEffect(() => {
    setGroupedFollowUps(groupByDate(followUps));
  }, [followUps, groupByDate]);

  // Initial load
  useEffect(() => {
    if (parentId && apiKey) {
      loadFollowUps(1);
    }
  }, [parentId, apiKey, loadFollowUps]);

  return {
    followUps,
    groupedFollowUps,
    loading,
    hasMore,
    error,
    loadMore,
    addFollowUp,
    refresh,
    totalPages,
    currentPage,
  };
};
