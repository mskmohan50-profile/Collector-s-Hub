import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, MapPin, Heart, BookPlus, Tag, ShoppingCart } from 'lucide-react';
import { LISTINGS } from '../data';
import { useCollection } from '../context/CollectionContext';
import { useSimulatedFetch } from '../hooks/useSimulatedFetch';
import { SafeImage } from '../components/SafeImage';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ListingGridSkeleton } from '../components/ui/Skeletons';
import { ErrorState } from '../components/ui/States';
import { Modal } from '../components/ui/Modal';
import { COLLECTION_LABELS, type CollectionKey, type Listing } from '../types';

export function ListingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem, hasItem, collectionOf } = useCollection();
  const [pickerOpen, setPickerOpen] = useState(false);

  const { data: listing, loading, error } = useSimulatedFetch<Listing | undefined>(
    () => LISTINGS.find((l) => l.id === id),
    [id],
    500,
  );

  if (loading) {
    return (
      <div>
        <div className="mb-4 h-4 w-24 skeleton rounded" />
        <ListingGridSkeleton count={1} />
      </div>
    );
  }
  if (error) return <ErrorState message={error} onRetry={() => navigate(0)} />;
  if (!listing)
    return (
      <ErrorState
        message="This listing could not be found. It may have been removed."
        onRetry={() => navigate('/marketplace')}
      />
    );

  const currentCollection = collectionOf(listing.id);

  return (
    <div className="animate-fade-in">
      <Link
        to="/marketplace"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 transition-colors hover:text-brand-600 dark:text-gray-400"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Marketplace
      </Link>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
          <SafeImage
            src={listing.image}
            alt={listing.title}
            fallbackLabel="Image unavailable"
            className="aspect-square w-full object-cover"
          />
        </div>

        <div className="flex flex-col">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="brand">{listing.category}</Badge>
            <Badge tone="neutral">{listing.condition}</Badge>
            {currentCollection && (
              <Badge tone="success">In {COLLECTION_LABELS[currentCollection as CollectionKey]}</Badge>
            )}
          </div>

          <h1 className="mt-3 font-display text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
            {listing.title}
          </h1>

          <p className="mt-3 text-gray-600 dark:text-gray-300">{listing.description}</p>

          <div className="mt-5 flex items-end justify-between rounded-2xl bg-gray-50 p-4 dark:bg-gray-900/60">
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-400">Price</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                ${listing.price.toLocaleString()}
              </p>
            </div>
            <div className="text-right text-sm text-gray-500 dark:text-gray-400">
              <p className="flex items-center justify-end gap-1.5 font-medium text-gray-700 dark:text-gray-200">
                {listing.seller}
              </p>
              <p className="mt-0.5 flex items-center justify-end gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {listing.location}
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Button onClick={() => setPickerOpen(true)} className="flex-1" size="lg">
              <BookPlus className="h-5 w-5" />
              Add to Collection
            </Button>
            <Button
              variant={hasItem(listing.id, 'wishlist') ? 'secondary' : 'outline'}
              size="lg"
              onClick={() => addItem(listing, 'wishlist')}
            >
              <Heart
                className="h-5 w-5"
                fill={hasItem(listing.id, 'wishlist') ? 'currentColor' : 'none'}
              />
              {hasItem(listing.id, 'wishlist') ? 'Wishlisted' : 'Wishlist'}
            </Button>
          </div>

          <div className="mt-4 flex flex-wrap gap-3 text-xs text-gray-400">
            <span className="inline-flex items-center gap-1">
              <Tag className="h-3.5 w-3.5" /> Listed {new Date(listing.createdAt).toLocaleDateString()}
            </span>
            <span className="inline-flex items-center gap-1">
              <ShoppingCart className="h-3.5 w-3.5" /> Mock listing — no real purchase
            </span>
          </div>
        </div>
      </div>

      <CollectionPickerModal
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        listing={listing}
        onPick={(c) => {
          addItem(listing, c);
          setPickerOpen(false);
        }}
      />
    </div>
  );
}

function CollectionPickerModal({
  open,
  onClose,
  listing,
  onPick,
}: {
  open: boolean;
  onClose: () => void;
  listing: Listing;
  onPick: (c: CollectionKey) => void;
}) {
  const { hasItem } = useCollection();
  const options: { key: CollectionKey; icon: typeof Heart; desc: string }[] = [
    { key: 'owned', icon: BookPlus, desc: 'Items you already own' },
    { key: 'wishlist', icon: Heart, desc: 'Items you want to acquire' },
    { key: 'selling', icon: Tag, desc: 'Items you are offering' },
  ];
  return (
    <Modal open={open} onClose={onClose} labelledBy="picker-title" maxWidth="max-w-md">
      <h2 id="picker-title" className="pr-8 text-lg font-bold text-gray-900 dark:text-white">
        Add to collection
      </h2>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{listing.title}</p>
      <div className="mt-4 flex flex-col gap-2">
        {options.map(({ key, icon: Icon, desc }) => {
          const exists = hasItem(listing.id, key);
          return (
            <button
              key={key}
              onClick={() => onPick(key)}
              disabled={exists}
              className={`flex items-center gap-3 rounded-xl border p-3 text-left transition-colors ${
                exists
                  ? 'cursor-not-allowed border-gray-200 bg-gray-50 opacity-60 dark:border-gray-800 dark:bg-gray-900'
                  : 'border-gray-200 hover:border-brand-400 hover:bg-brand-50 dark:border-gray-700 dark:hover:border-brand-600 dark:hover:bg-brand-950/40'
              }`}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-100 text-brand-600 dark:bg-brand-950/60 dark:text-brand-300">
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900 dark:text-white">{COLLECTION_LABELS[key]}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{desc}</p>
              </div>
              {exists && (
                <Badge tone="neutral">Already added</Badge>
              )}
            </button>
          );
        })}
      </div>
    </Modal>
  );
}
