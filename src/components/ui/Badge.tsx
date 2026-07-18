import type { ReactNode } from 'react';

type Tone = 'brand' | 'neutral' | 'success' | 'warning' | 'error' | 'accent';

const tones: Record<Tone, string> = {
  brand: 'bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-200',
  neutral: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  success: 'bg-success-50 text-success-700 dark:bg-success-950/50 dark:text-success-300',
  warning: 'bg-warning-50 text-warning-700 dark:bg-warning-950/50 dark:text-warning-300',
  error: 'bg-error-50 text-error-700 dark:bg-error-950/50 dark:text-error-300',
  accent: 'bg-accent-50 text-accent-700 dark:bg-accent-950/50 dark:text-accent-300',
};

export function Badge({
  children,
  tone = 'neutral',
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${tones[tone]} ${className ?? ''}`}
    >
      {children}
    </span>
  );
}
