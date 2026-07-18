import type { LucideIcon } from 'lucide-react';
import { PackageOpen, SearchX, AlertCircle } from 'lucide-react';

export function EmptyState({
  icon: Icon = PackageOpen,
  title,
  message,
  action,
}: {
  icon?: LucideIcon;
  title: string;
  message?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white/50 px-6 py-16 text-center dark:border-gray-700 dark:bg-gray-900/30">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-400 dark:bg-gray-800">
        <Icon className="h-7 w-7" strokeWidth={1.5} />
      </div>
      <h3 className="mt-4 text-base font-semibold text-gray-800 dark:text-gray-100">{title}</h3>
      {message && (
        <p className="mt-1 max-w-sm text-sm text-gray-500 dark:text-gray-400">{message}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function NoResultsState({ query }: { query?: string }) {
  return (
    <EmptyState
      icon={SearchX}
      title="No results found"
      message={
        query
          ? `Nothing matches "${query}". Try a different keyword or clear your filters.`
          : 'Try adjusting your search or filters to find what you\'re looking for.'
      }
    />
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-error-200 bg-error-50/50 px-6 py-16 text-center dark:border-error-900/50 dark:bg-error-950/20">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-error-100 text-error-600 dark:bg-error-900/40 dark:text-error-400">
        <AlertCircle className="h-7 w-7" strokeWidth={1.5} />
      </div>
      <h3 className="mt-4 text-base font-semibold text-gray-800 dark:text-gray-100">
        Something went wrong
      </h3>
      <p className="mt-1 max-w-sm text-sm text-gray-600 dark:text-gray-400">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-5 rounded-xl bg-brand-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700"
        >
          Try again
        </button>
      )}
    </div>
  );
}
