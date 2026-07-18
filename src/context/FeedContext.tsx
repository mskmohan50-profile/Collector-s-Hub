import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { POSTS } from '../data';
import type { Post } from '../types';

interface FeedContextValue {
  posts: Post[];
  toggleLike: (id: string) => void;
  toggleSave: (id: string) => void;
  addComment: (id: string, text: string) => void;
}

const FeedContext = createContext<FeedContextValue | null>(null);

export function FeedProvider({ children }: { children: React.ReactNode }) {
  const [posts, setPosts] = useState<Post[]>(() => POSTS.map((p) => ({ ...p })));

  const toggleLike = useCallback((id: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              liked: !p.liked,
              likes: p.liked ? p.likes - 1 : p.likes + 1,
            }
          : p,
      ),
    );
  }, []);

  const toggleSave = useCallback((id: string) => {
    setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, saved: !p.saved } : p)));
  }, []);

  const addComment = useCallback((id: string, text: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              comments: [
                ...p.comments,
                {
                  id: `c-${Date.now()}`,
                  user: 'You',
                  avatar: '',
                  text,
                  createdAt: new Date().toISOString(),
                },
              ],
            }
          : p,
      ),
    );
  }, []);

  const value = useMemo(
    () => ({ posts, toggleLike, toggleSave, addComment }),
    [posts, toggleLike, toggleSave, addComment],
  );

  return <FeedContext.Provider value={value}>{children}</FeedContext.Provider>;
}

export function useFeed() {
  const ctx = useContext(FeedContext);
  if (!ctx) throw new Error('useFeed must be used within FeedProvider');
  return ctx;
}
