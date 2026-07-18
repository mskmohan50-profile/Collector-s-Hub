import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { FilterBar, DEFAULT_FILTERS, type FilterState } from '../components/FilterBar';
import { ListingCard, ListingRow } from '../components/ListingCard';
import { ListingGridSkeleton } from '../components/ui/Skeletons';
import { EmptyState, NoResultsState, ErrorState } from '../components/ui/States';
import { useSimulatedFetch } from '../hooks/useSimulatedFetch';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { LISTINGS } from '../data';
import type { Listing } from '../types';

export function MarketplacePage() {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const debouncedQuery = useDebouncedValue(filters.query, 250);
  const navigate = useNavigate();

  const { data, loading, error } = useSimulatedFetch<Listing[]>(() => LISTINGS, [], 600);

  const filtered = useMemo(() => {
    if (!data) return [];
    let list = data.filter((l) => {
      const matchesQuery =
        !debouncedQuery ||
        l.title.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
        l.seller.toLowerCase().includes(debouncedQuery.toLowerCase());
      const matchesCategory = filters.category === 'all' || l.category === filters.category;
      const matchesCondition = filters.condition === 'all' || l.condition === filters.condition;
      return matchesQuery && matchesCategory && matchesCondition;
    });
    list = [...list].sort((a, b) => {
      if (filters.sort === 'price-asc') return a.price - b.price;
      if (filters.sort === 'price-desc') return b.price - a.price;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    return list;
  }, [data, debouncedQuery, filters.category, filters.condition, filters.sort]);

  return (
    <div>
      <PageHeader
        title="Marketplace"
        subtitle="Browse collectible items available from sellers around the world."
      />

      <FilterBar
        filters={filters}
        onChange={setFilters}
        showCondition
        showSort
        showViewToggle
        searchPlaceholder="Search by title or seller..."
      />

      <div className="mt-6">
        {loading ? (
          <ListingGridSkeleton />
        ) : error ? (
          <ErrorState message={error} onRetry={() => navigate(0)} />
        ) : filtered.length === 0 ? (
          debouncedQuery || filters.category !== 'all' || filters.condition !== 'all' ? (
            <NoResultsState query={debouncedQuery} />
          ) : (
            <EmptyState
              icon={Compass}
              title="No listings yet"
              message="Check back soon — sellers are adding new items all the time."
            />
          )
        ) : filters.view === 'grid' ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((l) => (
              <ListingCard key={l.id} listing={l} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((l) => (
              <ListingRow key={l.id} listing={l} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
