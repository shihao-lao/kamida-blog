'use client';

import { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';

export default function VisitCounter() {
  const [visits, setVisits] = useState(0);
  const [loading, setLoading] = useState(true);
  const [hasIncremented, setHasIncremented] = useState(false);

  useEffect(() => {
    const fetchAndIncrementVisits = async () => {
      try {
        const res = await fetch('/api/visits');
        const data = await res.json();
        setVisits(data.count || 0);
        setLoading(false);

        if (!hasIncremented) {
          setHasIncremented(true);
          await fetch('/api/visits', { method: 'POST' });
        }
      } catch (error) {
        console.error('Failed to fetch visits:', error);
        setLoading(false);
      }
    };

    fetchAndIncrementVisits();
  }, [hasIncremented]);

  const formatNumber = (num) => {
    return num.toLocaleString('zh-CN');
  };

  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-lg shadow-sm">
      <Eye className="w-5 h-5 text-blue-500 dark:text-blue-400" />
      <span className="text-sm text-gray-600 dark:text-gray-300">
        访问次数
      </span>
      <span className="font-bold text-blue-600 dark:text-blue-400 text-lg">
        {loading ? (
          <span className="animate-pulse">...</span>
        ) : (
          formatNumber(visits)
        )}
      </span>
    </div>
  );
}
