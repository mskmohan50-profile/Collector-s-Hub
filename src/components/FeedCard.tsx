import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Bookmark } from 'lucide-react';
import type { Post } from '../types';
import { SafeImage } from './SafeImage';
import { Badge } from './ui/Badge';

interface FeedCardProps {
  post: Post;
  onLike: (id: string) => void;
  onSave: (id: string) => void;
}

export function FeedCard({ post, onLike, onSave }: FeedCardProps) {
  const [animating, setAnimating] = useState(false);

  const handleLike = () => {
    if (!post.liked) {
      setAnimating(true);
      setTimeout(() => setAnimating(false), 400);
    }
    onLike(post.id);
  };

  return (
    <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center gap-3 p-4">
        <SafeImage
          src={post.user.avatar}
          alt={post.user.name}
          fallbackLabel=""
          className="h-10 w-10 rounded-full object-cover"
        />
        <div className="flex-1">
          <Link
            to={`/community/${post.id}`}
            className="font-semibold text-gray-900 hover:text-brand-600 dark:text-white"
          >
            {post.user.name}
          </Link>
          <p className="text-xs text-gray-500 dark:text-gray-400">{post.user.handle}</p>
        </div>
        <Badge tone="brand">{post.category}</Badge>
      </div>

      <Link to={`/community/${post.id}`} className="block">
        <div className="aspect-square w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
          <SafeImage
            src={post.image}
            alt={post.caption}
            fallbackLabel="Image unavailable"
            className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.02]"
          />
        </div>
      </Link>

      <div className="p-4">
        <div className="flex items-center gap-4">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 text-sm font-medium transition-transform ${animating ? 'scale-125' : 'scale-100'} ${post.liked ? 'text-error-500' : 'text-gray-500 hover:text-error-500 dark:text-gray-400'}`}
            aria-pressed={post.liked}
            aria-label="Like post"
          >
            <Heart className="h-5 w-5" fill={post.liked ? 'currentColor' : 'none'} />
            {post.likes}
          </button>
          <Link
            to={`/community/${post.id}`}
            className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-brand-600 dark:text-gray-400"
          >
            <MessageCircle className="h-5 w-5" />
            {post.comments.length}
          </Link>
          <button
            onClick={() => onSave(post.id)}
            className={`ml-auto flex items-center gap-1.5 text-sm font-medium transition-colors ${post.saved ? 'text-accent-600 dark:text-accent-400' : 'text-gray-500 hover:text-accent-600 dark:text-gray-400'}`}
            aria-pressed={post.saved}
            aria-label="Save post"
          >
            <Bookmark className="h-5 w-5" fill={post.saved ? 'currentColor' : 'none'} />
            {post.saved ? 'Saved' : 'Save'}
          </button>
        </div>
        <p className="mt-3 line-clamp-2 text-sm text-gray-700 dark:text-gray-200">
          <span className="font-semibold">{post.user.handle.replace('@', '')}</span>{' '}
          {post.caption}
        </p>
      </div>
    </article>
  );
}
