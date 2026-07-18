import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { FeedCard } from '../components/FeedCard';
import { Select } from '../components/ui/Select';
import { Input } from '../components/ui/Input';
import { FeedListSkeleton } from '../components/ui/Skeletons';
import { EmptyState, NoResultsState, ErrorState } from '../components/ui/States';
import { useFeed } from '../context/FeedContext';
import { useSimulatedFetch } from '../hooks/useSimulatedFetch';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { CATEGORIES, type Post } from '../types';

export function CommunityPage() {
  const { posts, toggleLike, toggleSave } = useFeed();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const debouncedQuery = useDebouncedValue(query, 250);
  const navigate = useNavigate();

  const { data, loading, error } = useSimulatedFetch<Post[]>(() => posts, [posts], 600);

  const filtered = useMemo(() => {
    if (!data) return [];
    return data.filter((p) => {
      const matchesQuery =
        !debouncedQuery ||
        p.caption.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
        p.user.name.toLowerCase().includes(debouncedQuery.toLowerCase());
      const matchesCategory = category === 'all' || p.category === category;
      return matchesQuery && matchesCategory;
    });
  }, [data, debouncedQuery, category]);

  return (
    <div>
      <PageHeader
        title="Community Feed"
        subtitle="Discover collectibles shared by fellow collectors."
      />

      <div className="mx-auto flex max-w-xl flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search posts or people..."
            aria-label="Search posts"
          />
        </div>
        <Select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          aria-label="Category"
        >
          <option value="all">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Select>
      </div>

      <div className="mt-6">
        {loading ? (
          <FeedListSkeleton />
        ) : error ? (
          <ErrorState message={error} onRetry={() => navigate(0)} />
        ) : filtered.length === 0 ? (
          debouncedQuery || category !== 'all' ? (
            <NoResultsState query={debouncedQuery} />
          ) : (
            <EmptyState
              icon={Sparkles}
              title="No posts yet"
              message="Be the first to share a collectible with the community."
            />
          )
        ) : (
          <div className="mx-auto flex max-w-xl flex-col gap-6">
            {filtered.map((p) => (
              <FeedCard key={p.id} post={p} onLike={toggleLike} onSave={toggleSave} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
