import { CheckCircle2, Info, X, XCircle } from 'lucide-react';
import { useCollection } from '../../context/CollectionContext';

export function ToastContainer() {
  const { toasts, dismissToast } = useCollection();

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex flex-col items-center gap-2 px-4 sm:bottom-6">
      {toasts.map((t) => {
        const Icon =
          t.type === 'success' ? CheckCircle2 : t.type === 'error' ? XCircle : Info;
        const tone =
          t.type === 'success'
            ? 'text-success-600 dark:text-success-400'
            : t.type === 'error'
              ? 'text-error-600 dark:text-error-400'
              : 'text-brand-600 dark:text-brand-400';
        return (
          <div
            key={t.id}
            role="status"
            className="pointer-events-auto flex w-full max-w-sm animate-slide-up items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-soft-lg dark:border-gray-700 dark:bg-gray-800"
          >
            <Icon className={`h-5 w-5 shrink-0 ${tone}`} />
            <p className="flex-1 text-sm text-gray-700 dark:text-gray-200">{t.message}</p>
            <button
              onClick={() => dismissToast(t.id)}
              className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700"
              aria-label="Dismiss"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
