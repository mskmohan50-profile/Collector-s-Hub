import { LayoutGrid, List } from 'lucide-react';
import { Select } from './ui/Select';
import { Input } from './ui/Input';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { CATEGORIES, CONDITIONS } from '../types';

export type SortOption = 'newest' | 'price-asc' | 'price-desc';

export interface FilterState {
  query: string;
  category: string;
  condition: string;
  sort: SortOption;
  view: 'grid' | 'list';
}

export const DEFAULT_FILTERS: FilterState = {
  query: '',
  category: 'all',
  condition: 'all',
  sort: 'newest',
  view: 'grid',
};

interface FilterBarProps {
  filters: FilterState;
  onChange: (next: FilterState) => void;
  showCondition?: boolean;
  showSort?: boolean;
  showViewToggle?: boolean;
  searchPlaceholder?: string;
}

export function FilterBar({
  filters,
  onChange,
  showCondition = true,
  showSort = true,
  showViewToggle = false,
  searchPlaceholder = 'Search...',
}: FilterBarProps) {
  const debouncedQuery = useDebouncedValue(filters.query, 250);
  void debouncedQuery;

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900 sm:flex-row sm:items-end">
      <div className="flex-1">
        <Input
          value={filters.query}
          onChange={(e) => onChange({ ...filters, query: e.target.value })}
          placeholder={searchPlaceholder}
          aria-label="Search"
        />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:flex sm:items-end sm:gap-3">
        <Select
          value={filters.category}
          onChange={(e) => onChange({ ...filters, category: e.target.value })}
          aria-label="Category"
        >
          <option value="all">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Select>

        {showCondition && (
          <Select
            value={filters.condition}
            onChange={(e) => onChange({ ...filters, condition: e.target.value })}
            aria-label="Condition"
          >
            <option value="all">All conditions</option>
            {CONDITIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        )}

        {showSort && (
          <Select
            value={filters.sort}
            onChange={(e) => onChange({ ...filters, sort: e.target.value as SortOption })}
            aria-label="Sort"
          >
            <option value="newest">Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </Select>
        )}

        {showViewToggle && (
          <div className="flex items-end gap-1">
            <button
              onClick={() => onChange({ ...filters, view: 'grid' })}
              aria-label="Grid view"
              className={`flex h-[42px] w-10 items-center justify-center rounded-xl border transition-colors ${
                filters.view === 'grid'
                  ? 'border-brand-500 bg-brand-50 text-brand-600 dark:bg-brand-950/60 dark:text-brand-300'
                  : 'border-gray-300 text-gray-500 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800'
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => onChange({ ...filters, view: 'list' })}
              aria-label="List view"
              className={`flex h-[42px] w-10 items-center justify-center rounded-xl border transition-colors ${
                filters.view === 'list'
                  ? 'border-brand-500 bg-brand-50 text-brand-600 dark:bg-brand-950/60 dark:text-brand-300'
                  : 'border-gray-300 text-gray-500 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800'
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
