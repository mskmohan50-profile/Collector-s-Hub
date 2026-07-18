import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { CollectionProvider } from './context/CollectionContext';
import { FeedProvider } from './context/FeedContext';
import { Layout } from './components/Layout';
import { ToastContainer } from './components/ui/Toast';
import { MarketplacePage } from './pages/MarketplacePage';
import { ListingDetailPage } from './pages/ListingDetailPage';
import { CommunityPage } from './pages/CommunityPage';
import { PostDetailPage } from './pages/PostDetailPage';
import { CollectionPage } from './pages/CollectionPage';

function App() {
  return (
    <ThemeProvider>
      <CollectionProvider>
        <FeedProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<Layout />}>
                <Route index element={<Navigate to="/marketplace" replace />} />
                <Route path="/marketplace" element={<MarketplacePage />} />
                <Route path="/marketplace/:id" element={<ListingDetailPage />} />
                <Route path="/community" element={<CommunityPage />} />
                <Route path="/community/:id" element={<PostDetailPage />} />
                <Route path="/collection" element={<CollectionPage />} />
                <Route path="*" element={<Navigate to="/marketplace" replace />} />
              </Route>
            </Routes>
            <ToastContainer />
          </BrowserRouter>
        </FeedProvider>
      </CollectionProvider>
    </ThemeProvider>
  );
}

export default App;
