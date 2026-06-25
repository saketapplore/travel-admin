import { useState, useEffect, useCallback, useRef } from 'react';
import { reportingService } from '@/services/reportingService';

const fmt = (d) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

// Default window = current calendar month.
export const currentMonthRange = () => {
  const now = new Date();
  return {
    from: fmt(new Date(now.getFullYear(), now.getMonth(), 1)),
    to: fmt(new Date(now.getFullYear(), now.getMonth() + 1, 0))
  };
};

const AUTO_REFRESH_MS = 60000;

/**
 * Drives the consolidated bookings dashboard (Point 4):
 * date window, view switch (consolidated/stays/hotels/flights), and auto-refresh.
 */
export const useReporting = () => {
  const init = currentMonthRange();
  const [from, setFrom] = useState(init.from);
  const [to, setTo] = useState(init.to);
  const [view, setView] = useState('consolidated');
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);
  const mounted = useRef(true);

  const fetchSummary = useCallback(
    async ({ silent = false } = {}) => {
      if (!silent) setLoading(true);
      setError('');
      try {
        const res = await reportingService.getSummary({ from, to });
        const data = res?.data?.data || null;
        if (!mounted.current) return;
        setSummary(data);
        setLastUpdated(new Date());
      } catch (err) {
        if (mounted.current) setError(err?.message || 'Failed to load report.');
      } finally {
        if (mounted.current && !silent) setLoading(false);
      }
    },
    [from, to]
  );

  useEffect(() => {
    mounted.current = true;
    fetchSummary();
    // Auto-refresh with the latest booking data.
    const id = setInterval(() => fetchSummary({ silent: true }), AUTO_REFRESH_MS);
    return () => {
      mounted.current = false;
      clearInterval(id);
    };
  }, [fetchSummary]);

  const setPreset = useCallback((preset) => {
    const now = new Date();
    if (preset === 'thisMonth') {
      setFrom(fmt(new Date(now.getFullYear(), now.getMonth(), 1)));
      setTo(fmt(new Date(now.getFullYear(), now.getMonth() + 1, 0)));
    } else if (preset === 'lastMonth') {
      setFrom(fmt(new Date(now.getFullYear(), now.getMonth() - 1, 1)));
      setTo(fmt(new Date(now.getFullYear(), now.getMonth(), 0)));
    } else if (preset === 'last7') {
      const seven = new Date(now);
      seven.setDate(now.getDate() - 6);
      setFrom(fmt(seven));
      setTo(fmt(now));
    }
  }, []);

  return {
    from,
    setFrom,
    to,
    setTo,
    view,
    setView,
    setPreset,
    summary,
    loading,
    error,
    lastUpdated,
    refresh: () => fetchSummary()
  };
};

export default useReporting;
