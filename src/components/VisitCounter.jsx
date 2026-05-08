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
    <div 
      className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all"
      style={{ 
        backgroundColor: 'var(--brand-primary-light)',
        border: '1px solid var(--border-primary)'
      }}
    >
      <Eye className="w-5 h-5" style={{ color: 'var(--brand-primary)' }} />
      <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
        访问次数
      </span>
      <span className="font-bold text-lg" style={{ color: 'var(--brand-primary)' }}>
        {loading ? (
          <span className="animate-pulse">...</span>
        ) : (
          formatNumber(visits)
        )}
      </span>
    </div>
  );
}
