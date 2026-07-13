import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Header } from './components/Header/Header';
import { LibraryProvider } from './context/LibraryContext';
import { Home } from './pages/Home'; 
import { Library } from './pages/Library';
import { Footer } from './components/Footer/Footer';
import GameDetails from './components/GameDetails/GameDetails';
import { Auth } from './pages/Auth/Auth';
import { Profile } from './pages/Profile/Profile';
import { Checkout } from './pages/Checkout/Checkout';
import NewsBlogs from './pages/NewsBlogs/NewsBlogs';
import Giveaways from './pages/Giveaways/Giveaways';
import Catalog from './pages/Catalog/Catalog';
import Wishlist from './pages/Wishlist/Wishlist';
import { WishlistProvider } from './context/WishlistContext';

function App() {
  const themeMode = useSelector((state) => state.theme.mode);

  return (
    <AuthProvider>
      <LibraryProvider>
       
        <WishlistProvider>
          <BrowserRouter basename="/CoreGames_Project">
            <div 
              data-theme={themeMode} 
              style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                minHeight: '100vh',
                transition: 'all 0.3s ease'
              }}
            >
              <Header />
              <main style={{ flex: 1 }}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/game/:id" element={<GameDetails />} />
                  <Route path="/login" element={<Auth />} />
                  <Route path="/catalog" element={<Catalog />} />
                  <Route path="/news" element={<NewsBlogs />} />
                  <Route path="/giveaways" element={<Giveaways />} />
                  
                  {/* დაცული მარშრუტები (Protected Routes) */}
                  <Route element={<ProtectedRoute />}>
                    <Route path="/library" element={<Library />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/wishlist" element={<Wishlist />} />
                  </Route>
                </Routes>
              </main>
              <Footer />
            </div> 
          </BrowserRouter>
        </WishlistProvider>
      </LibraryProvider>
    </AuthProvider>
  );
}

export default App;