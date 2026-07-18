import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Compass, LayoutGrid, Heart, Moon, Sun, Sparkles } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useCollection } from '../context/CollectionContext';

const navItems = [
  { to: '/marketplace', label: 'Marketplace', icon: Compass },
  { to: '/community', label: 'Community', icon: Sparkles },
  { to: '/collection', label: 'My Collection', icon: LayoutGrid },
];

export function Layout() {
  const { theme, toggleTheme } = useTheme();
  const { counts } = useCollection();
  const location = useLocation();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-800 dark:bg-gray-950/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <NavLink to="/marketplace" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-sm">
              <Heart className="h-5 w-5" fill="currentColor" />
            </div>
            <div className="hidden sm:block">
              <span className="font-display text-lg font-bold tracking-tight text-gray-900 dark:text-white">
                Collector's Hub
              </span>
            </div>
          </NavLink>

          <nav className="flex items-center gap-1">
            {navItems.map(({ to, label, icon: Icon }) => {
              const active = location.pathname.startsWith(to);
              const badge = to === '/collection' ? counts.owned + counts.wishlist + counts.selling : null;
              return (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `relative flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors sm:px-4 ${
                      isActive || active
                        ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-200'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white'
                    }`
                  }
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{label}</span>
                  {badge ? (
                    <span className="ml-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-600 px-1.5 text-[10px] font-semibold text-white">
                      {badge}
                    </span>
                  ) : null}
                </NavLink>
              );
            })}
          </nav>

          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="flex h-10 w-10 items-center justify-center rounded-xl text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </div>
      </header>

      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
          <Outlet />
        </div>
      </main>

      <footer className="border-t border-gray-200 py-6 text-center text-xs text-gray-400 dark:border-gray-800">
        Collector's Hub — a demo marketplace & community for collectors.
      </footer>
    </div>
  );
}
