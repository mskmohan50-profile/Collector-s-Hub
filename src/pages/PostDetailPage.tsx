import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Heart, MessageCircle, Bookmark, Send } from 'lucide-react';
import { useFeed } from '../context/FeedContext';
import { useSimulatedFetch } from '../hooks/useSimulatedFetch';
import { SafeImage } from '../components/SafeImage';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { ErrorState } from '../components/ui/States';
import { FeedCardSkeleton } from '../components/ui/Skeletons';
import type { Post } from '../types';

export function PostDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { posts, toggleLike, toggleSave, addComment } = useFeed();
  const [comment, setComment] = useState('');

  const { data: post, loading, error } = useSimulatedFetch<Post | undefined>(
    () => posts.find((p) => p.id === id),
    [posts, id],
    500,
  );

  if (loading)
    return (
      <div className="mx-auto max-w-xl">
        <div className="mb-4 h-4 w-24 skeleton rounded" />
        <FeedCardSkeleton />
      </div>
    );
  if (error) return <ErrorState message={error} onRetry={() => navigate(0)} />;
  if (!post)
    return (
      <ErrorState
        message="This post could not be found or was removed."
        onRetry={() => navigate('/community')}
      />
    );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    addComment(post.id, comment.trim());
    setComment('');
  };

  return (
    <div className="mx-auto max-w-2xl animate-fade-in">
      <Link
        to="/community"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 transition-colors hover:text-brand-600 dark:text-gray-400"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Community
      </Link>

      <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-center gap-3 p-4">
          <SafeImage
            src={post.user.avatar}
            alt={post.user.name}
            fallbackLabel=""
            className="h-11 w-11 rounded-full object-cover"
          />
          <div className="flex-1">
            <p className="font-semibold text-gray-900 dark:text-white">{post.user.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{post.user.handle}</p>
          </div>
          <Badge tone="brand">{post.category}</Badge>
        </div>

        <div className="aspect-square w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
          <SafeImage
            src={post.image}
            alt={post.caption}
            fallbackLabel="Image unavailable"
            className="h-full w-full object-cover"
          />
        </div>

        <div className="p-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => toggleLike(post.id)}
              className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${post.liked ? 'text-error-500' : 'text-gray-500 hover:text-error-500 dark:text-gray-400'}`}
              aria-pressed={post.liked}
            >
              <Heart className="h-5 w-5" fill={post.liked ? 'currentColor' : 'none'} />
              {post.likes}
            </button>
            <button
              onClick={() => toggleSave(post.id)}
              className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${post.saved ? 'text-accent-600 dark:text-accent-400' : 'text-gray-500 hover:text-accent-600 dark:text-gray-400'}`}
              aria-pressed={post.saved}
            >
              <Bookmark className="h-5 w-5" fill={post.saved ? 'currentColor' : 'none'} />
              {post.saved ? 'Saved' : 'Save'}
            </button>
          </div>

          <p className="mt-3 text-gray-700 dark:text-gray-200">
            <span className="font-semibold">{post.user.handle.replace('@', '')}</span> {post.caption}
          </p>
        </div>

        <div className="border-t border-gray-100 p-4 dark:border-gray-800">
          <h2 className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 dark:text-gray-200">
            <MessageCircle className="h-4 w-4" />
            Comments ({post.comments.length})
          </h2>

          <div className="mt-3 flex flex-col gap-3">
            {post.comments.length === 0 ? (
              <p className="text-sm text-gray-400">No comments yet — be the first to chime in.</p>
            ) : (
              post.comments.map((c) => (
                <div key={c.id} className="flex gap-2.5">
                  <SafeImage
                    src={c.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${c.user}`}
                    alt={c.user}
                    fallbackLabel=""
                    className="h-8 w-8 shrink-0 rounded-full object-cover"
                  />
                  <div className="rounded-xl bg-gray-50 px-3 py-2 dark:bg-gray-800/60">
                    <p className="text-xs font-semibold text-gray-800 dark:text-gray-100">{c.user}</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{c.text}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
            <input
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
            />
            <Button type="submit" size="md" disabled={!comment.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </article>
    </div>
  );
}
