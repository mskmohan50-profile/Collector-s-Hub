import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import type { Listing } from '../types';
import { SafeImage } from './SafeImage';
import { Badge } from './ui/Badge';

const conditionTone: Record<string, 'success' | 'brand' | 'warning' | 'neutral'> = {
  Mint: 'success',
  'Near Mint': 'success',
  Excellent: 'brand',
  Good: 'warning',
  Fair: 'neutral',
  Poor: 'neutral',
} as const;

export function ListingCard({ listing }: { listing: Listing }) {
  return (
    <Link
      to={`/marketplace/${listing.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all hover:-translate-y-0.5 hover:shadow-soft-lg dark:border-gray-800 dark:bg-gray-900"
    >
      <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800">
        <SafeImage
          src={listing.image}
          alt={listing.title}
          fallbackLabel="Image unavailable"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex gap-2">
          <Badge tone="brand" className="bg-white/90 backdrop-blur dark:bg-gray-900/80">
            {listing.category}
          </Badge>
        </div>
        <div className="absolute right-3 top-3">
          <Badge tone={conditionTone[listing.condition] ?? 'neutral'} className="bg-white/90 backdrop-blur dark:bg-gray-900/80">
            {listing.condition}
          </Badge>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-1 font-semibold text-gray-900 dark:text-white">
          {listing.title}
        </h3>
        <p className="mt-0.5 line-clamp-1 text-xs text-gray-500 dark:text-gray-400">
          {listing.seller}
        </p>
        <div className="mt-1 flex items-center gap-1 text-xs text-gray-400">
          <MapPin className="h-3 w-3" />
          <span className="line-clamp-1">{listing.location}</span>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900 dark:text-white">
            ${listing.price.toLocaleString()}
          </span>
          <span className="text-xs font-medium text-brand-600 opacity-0 transition-opacity group-hover:opacity-100 dark:text-brand-400">
            View details →
          </span>
        </div>
      </div>
    </Link>
  );
}

export function ListingRow({ listing }: { listing: Listing }) {
  return (
    <Link
      to={`/marketplace/${listing.id}`}
      className="group flex gap-4 overflow-hidden rounded-2xl border border-gray-200 bg-white p-3 transition-all hover:shadow-soft dark:border-gray-800 dark:bg-gray-900"
    >
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
        <SafeImage
          src={listing.image}
          alt={listing.title}
          fallbackLabel="N/A"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col justify-center">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="brand">{listing.category}</Badge>
          <Badge tone={conditionTone[listing.condition] ?? 'neutral'}>{listing.condition}</Badge>
        </div>
        <h3 className="mt-1.5 line-clamp-1 font-semibold text-gray-900 dark:text-white">
          {listing.title}
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {listing.seller} · {listing.location}
        </p>
        <span className="mt-1 text-base font-bold text-gray-900 dark:text-white">
          ${listing.price.toLocaleString()}
        </span>
      </div>
    </Link>
  );
}
