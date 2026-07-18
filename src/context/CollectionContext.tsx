import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { CollectionItem, CollectionKey, Listing } from '../types';

const STORAGE_KEY = 'collectors-hub:collections:v1';

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface CollectionContextValue {
  items: CollectionItem[];
  toasts: Toast[];
  addItem: (listing: Listing, collection: CollectionKey) => void;
  removeItem: (id: string) => void;
  moveItem: (id: string, target: CollectionKey) => void;
  hasItem: (listingId: string, collection: CollectionKey) => boolean;
  collectionOf: (listingId: string) => CollectionKey | null;
  dismissToast: (id: number) => void;
  counts: Record<CollectionKey, number>;
}

const CollectionContext = createContext<CollectionContextValue | null>(null);

function loadInitial(): CollectionItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function estimateValue(price: number): number {
  const variance = (Math.sin(price) + 1) / 2; 
  const factor = 0.82 + variance * 0.36;
  return Math.round(price * factor);
}

let toastId = 0;

export function CollectionProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CollectionItem[]>(loadInitial);
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      
    }
  }, [items]);

  const pushToast = useCallback((message: string, type: Toast['type'] = 'success') => {
    const id = ++toastId;
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, 3200);
  }, []);

  const dismissToast = useCallback((id: number) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const addItem = useCallback(
    (listing: Listing, collection: CollectionKey) => {
      setItems((prev) => {
        const exists = prev.find(
          (i) => i.listingId === listing.id && i.collection === collection,
        );
        if (exists) {
          pushToast(`Already in ${collectionLabel(collection)}`, 'info');
          return prev;
        }
        const inOther = prev.find((i) => i.listingId === listing.id);
        if (inOther) {
          pushToast(`Moved to ${collectionLabel(collection)}`, 'success');
          return prev.map((i) =>
            i.id === inOther.id
              ? { ...i, collection, addedAt: new Date().toISOString() }
              : i,
          );
        }
        pushToast(`Added to ${collectionLabel(collection)}`, 'success');
        const newItem: CollectionItem = {
          id: `${collection}-${listing.id}`,
          listingId: listing.id,
          collection,
          title: listing.title,
          category: listing.category,
          image: listing.image,
          price: listing.price,
          addedAt: new Date().toISOString(),
          estimatedValue: estimateValue(listing.price),
        };
        return [...prev, newItem];
      });
    },
    [pushToast],
  );

  const removeItem = useCallback(
    (id: string) => {
      setItems((prev) => prev.filter((i) => i.id !== id));
      pushToast('Removed from collection', 'info');
    },
    [pushToast],
  );

  const moveItem = useCallback(
    (id: string, target: CollectionKey) => {
      setItems((prev) => {
        const item = prev.find((i) => i.id === id);
        if (!item || item.collection === target) return prev;
        pushToast(`Moved to ${collectionLabel(target)}`, 'success');
        return prev.map((i) =>
          i.id === id
            ? {
                ...i,
                collection: target,
                id: `${target}-${i.listingId}`,
                addedAt: new Date().toISOString(),
              }
            : i,
        );
      });
    },
    [pushToast],
  );

  const hasItem = useCallback(
    (listingId: string, collection: CollectionKey) =>
      items.some((i) => i.listingId === listingId && i.collection === collection),
    [items],
  );

  const collectionOf = useCallback(
    (listingId: string) => items.find((i) => i.listingId === listingId)?.collection ?? null,
    [items],
  );

  const counts = useMemo<Record<CollectionKey, number>>(
    () => ({
      owned: items.filter((i) => i.collection === 'owned').length,
      wishlist: items.filter((i) => i.collection === 'wishlist').length,
      selling: items.filter((i) => i.collection === 'selling').length,
    }),
    [items],
  );

  const value: CollectionContextValue = {
    items,
    toasts,
    addItem,
    removeItem,
    moveItem,
    hasItem,
    collectionOf,
    dismissToast,
    counts,
  };

  return <CollectionContext.Provider value={value}>{children}</CollectionContext.Provider>;
}

function collectionLabel(c: CollectionKey) {
  return c.charAt(0).toUpperCase() + c.slice(1);
}

export function useCollection() {
  const ctx = useContext(CollectionContext);
  if (!ctx) throw new Error('useCollection must be used within CollectionProvider');
  return ctx;
}
