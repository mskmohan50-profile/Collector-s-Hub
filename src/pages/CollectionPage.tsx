import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { LayoutGrid, Trash2, ArrowRightLeft, Heart, BookPlus, Tag } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { FilterBar, DEFAULT_FILTERS, type FilterState } from '../components/FilterBar';
import { SafeImage } from '../components/SafeImage';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { EmptyState, NoResultsState } from '../components/ui/States';
import { ListingGridSkeleton } from '../components/ui/Skeletons';
import { Modal } from '../components/ui/Modal';
import { useCollection } from '../context/CollectionContext';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { useSimulatedFetch } from '../hooks/useSimulatedFetch';
import { COLLECTION_LABELS, type CollectionItem, type CollectionKey } from '../types';

const tabs: { key: CollectionKey; icon: typeof Heart; desc: string }[] = [
  { key: 'owned', icon: BookPlus, desc: 'Items you own' },
  { key: 'wishlist', icon: Heart, desc: 'Items you want' },
  { key: 'selling', icon: Tag, desc: 'Items you offer' },
];

export function CollectionPage() {
  const { items, removeItem, moveItem, counts } = useCollection();
  const [activeTab, setActiveTab] = useState<CollectionKey>('owned');
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [moveTarget, setMoveTarget] = useState<CollectionItem | null>(null);
  const debouncedQuery = useDebouncedValue(filters.query, 250);

  const { data, loading } = useSimulatedFetch<CollectionItem[]>(() => items, [items], 400);

  const tabItems = useMemo(() => {
    if (!data) return [];
    return data.filter((i) => i.collection === activeTab);
  }, [data, activeTab]);

  const filtered = useMemo(() => {
    let list = tabItems.filter((i) => {
      const matchesQuery =
        !debouncedQuery || i.title.toLowerCase().includes(debouncedQuery.toLowerCase());
      const matchesCategory = filters.category === 'all' || i.category === filters.category;
      return matchesQuery && matchesCategory;
    });
    list = [...list].sort((a, b) => {
      if (filters.sort === 'price-asc') return a.price - b.price;
      if (filters.sort === 'price-desc') return b.price - a.price;
      return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
    });
    return list;
  }, [tabItems, debouncedQuery, filters.category, filters.sort]);

  return (
    <div>
      <PageHeader
        title="My Collection"
        subtitle="Organize your collectibles across Owned, Wishlist, and Selling."
      />

      {/* Tabs */}
      <div className="mb-5 grid grid-cols-3 gap-2 sm:max-w-md">
        {tabs.map(({ key, icon: Icon, desc }) => {
          const active = activeTab === key;
          return (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex flex-col items-center gap-1 rounded-xl border p-3 text-center transition-colors ${
                active
                  ? 'border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-200'
                  : 'border-gray-200 text-gray-500 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-400 dark:hover:bg-gray-900'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-sm font-semibold">{COLLECTION_LABELS[key]}</span>
              <span className="text-xs">{counts[key]}</span>
              <span className="sr-only">{desc}</span>
            </button>
          );
        })}
      </div>

      <FilterBar
        filters={filters}
        onChange={setFilters}
        showCondition={false}
        showSort
        searchPlaceholder="Search your collection..."
      />

      <div className="mt-6">
        {loading ? (
          <ListingGridSkeleton count={4} />
        ) : filtered.length === 0 ? (
          debouncedQuery || filters.category !== 'all' ? (
            <NoResultsState query={debouncedQuery} />
          ) : (
            <EmptyState
              icon={LayoutGrid}
              title={`Your ${COLLECTION_LABELS[activeTab]} collection is empty`}
              message="Add items from the marketplace to start building this collection."
              action={
                <Link
                  to="/marketplace"
                  className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700"
                >
                  Browse Marketplace
                </Link>
              }
            />
          )
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((item) => (
              <CollectionItemCard
                key={item.id}
                item={item}
                onMove={() => setMoveTarget(item)}
                onRemove={() => removeItem(item.id)}
              />
            ))}
          </div>
        )}
      </div>

      <MoveModal
        item={moveTarget}
        onClose={() => setMoveTarget(null)}
        onMove={(target) => {
          if (moveTarget) moveItem(moveTarget.id, target);
          setMoveTarget(null);
        }}
      />
    </div>
  );
}

function CollectionItemCard({
  item,
  onMove,
  onRemove,
}: {
  item: CollectionItem;
  onMove: () => void;
  onRemove: () => void;
}) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800">
        <SafeImage
          src={item.image}
          alt={item.title}
          fallbackLabel="Image unavailable"
          className="h-full w-full object-cover"
        />
        <div className="absolute left-3 top-3">
          <Badge tone="brand" className="bg-white/90 backdrop-blur dark:bg-gray-900/80">
            {item.category}
          </Badge>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-1 font-semibold text-gray-900 dark:text-white">{item.title}</h3>
        <div className="mt-1 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>Added {new Date(item.addedAt).toLocaleDateString()}</span>
        </div>
        <div className="mt-2 flex items-end justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-wide text-gray-400">Est. value</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              ${item.estimatedValue.toLocaleString()}
            </p>
          </div>
          <div className="text-right text-xs text-gray-400">
            <p>Paid</p>
            <p className="font-medium text-gray-600 dark:text-gray-300">
              ${item.price.toLocaleString()}
            </p>
          </div>
        </div>
        <div className="mt-3 flex gap-2">
          <Button variant="outline" size="sm" fullWidth onClick={onMove}>
            <ArrowRightLeft className="h-4 w-4" />
            Move
          </Button>
          <Button variant="ghost" size="sm" onClick={onRemove} aria-label="Remove item">
            <Trash2 className="h-4 w-4 text-error-500" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function MoveModal({
  item,
  onClose,
  onMove,
}: {
  item: CollectionItem | null;
  onClose: () => void;
  onMove: (target: CollectionKey) => void;
}) {
  const targets = (['owned', 'wishlist', 'selling'] as CollectionKey[]).filter(
    (k) => item && k !== item.collection,
  );
  return (
    <Modal open={!!item} onClose={onClose} labelledBy="move-title" maxWidth="max-w-sm">
      <h2 id="move-title" className="pr-8 text-lg font-bold text-gray-900 dark:text-white">
        Move item
      </h2>
      {item && (
        <>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{item.title}</p>
          <div className="mt-4 flex flex-col gap-2">
            {targets.map((t) => (
              <button
                key={t}
                onClick={() => onMove(t)}
                className="flex items-center justify-between rounded-xl border border-gray-200 p-3 text-left transition-colors hover:border-brand-400 hover:bg-brand-50 dark:border-gray-700 dark:hover:border-brand-600 dark:hover:bg-brand-950/40"
              >
                <span className="font-medium text-gray-900 dark:text-white">
                  {COLLECTION_LABELS[t]}
                </span>
                <ArrowRightLeft className="h-4 w-4 text-brand-500" />
              </button>
            ))}
          </div>
        </>
      )}
    </Modal>
  );
}
