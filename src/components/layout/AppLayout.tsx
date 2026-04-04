import { ReactNode, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import MobileTopBar from './MobileTopBar';

const AppLayout = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Check if this is a public route or 404 page
  const isFullScreenRoute = [
    '/', 
    '/signin', 
    '/signup', 
    '/forgot-password', 
    '/dashboard',
    '/privacy',
    '/terms',
    '/support'
  ].includes(location.pathname) || 
  location.pathname.startsWith('/privacy') || 
  location.pathname.startsWith('/terms') || 
  location.pathname.startsWith('/support') ||
  // Check if this looks like a 404 (non-existent route)
  (!['/feed', '/profile', '/clans', '/battle-lobby', '/bounties', '/store', '/checkout', 
    '/manga', '/game', '/messages', '/notifications', '/leaderboard', 
    '/post', '/bet'].some(path => location.pathname.startsWith(path)) && 
    location.pathname !== '/');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  if (isFullScreenRoute) return <>{children}</>;

  return (
    <div className="min-h-screen zankoku-bg">
      <div className="scanline-overlay" />
      
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>
      
      {/* Tablet Icon Rail */}
      <div className="hidden md:block lg:hidden sidebar-rail">
        <Sidebar variant="rail" />
      </div>
      
      {/* Mobile Top Bar */}
      <div className="md:hidden">
        <MobileTopBar onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
      </div>
      
      {/* Main Content Area */}
      <main className="lg:ml-60 md:ml-[60px] min-h-screen pb-20 md:pb-0">
        <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-6">
          <div className="page-enter">
            {children}
          </div>
        </div>
      </main>
      
      {/* Mobile Bottom Navigation */}
      <div className="md:hidden">
        <Sidebar variant="bottom" />
      </div>
      
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default AppLayout;
