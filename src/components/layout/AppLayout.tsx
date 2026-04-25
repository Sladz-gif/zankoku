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
    '/support',
    '/game',
    '/dojo',
    '/tutorial/basic-combat',
    '/tutorial/advanced-strategies',
    '/tutorial/fighting-styles',
    '/tutorial/clan-warfare',
    '/tutorial/power-moves',
    '/tutorial/tournament-prep'
  ].includes(location.pathname) || 
  location.pathname.startsWith('/privacy') || 
  location.pathname.startsWith('/terms') || 
  location.pathname.startsWith('/support') ||
  location.pathname.startsWith('/tutorial/') ||
  // Check if this looks like a 404 (non-existent route)
  (!['/feed', '/profile', '/clans', '/battle-lobby', '/bounties', '/store', '/checkout', 
    '/manga', '/messages', '/notifications', '/leaderboard', 
    '/post', '/bet'].some(path => location.pathname.startsWith(path)) && 
    location.pathname !== '/');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Add/remove mobile sidebar open class to body
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.classList.add('mobile-sidebar-open');
    } else {
      document.body.classList.remove('mobile-sidebar-open');
    }
  }, [isMobileMenuOpen]);

  if (isFullScreenRoute) return <>{children}</>;

  return (
    <div className="h-[100dvh] w-screen overflow-hidden zankoku-bg">
      <div className="scanline-overlay" />
      
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>
      
      {/* Tablet Icon Rail */}
      <div className="hidden md:block lg:hidden">
        <Sidebar variant="rail" />
      </div>
      
      {/* Main Content Area */}
      <main className={`app-main h-[100dvh] overflow-y-auto ${location.pathname === '/feed' ? 'lg:mr-80' : ''}`}>
        <div className={`w-full max-w-none mx-auto py-6 ${location.pathname === '/feed' ? 'px-0' : 'px-4 md:px-6 lg:px-8'}`}>
          <div className="page-enter w-full">
            {children}
          </div>
        </div>
      </main>
      
      {/* Right Sidebar (Desktop only) - show ONLY on Feed page */}
      {location.pathname === '/feed' && (
        <div className="hidden lg:block fixed right-0 top-0 w-80 h-[100dvh] z-40">
          {/* Right sidebar content will be added here */}
        </div>
      )}
      
      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50">
        <MobileTopBar onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
      </div>
      
      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 safe-area-inset-bottom">
        <Sidebar variant="bottom" />
      </div>
      
      {/* Mobile Sidebar */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          {/* Sidebar */}
          <div className="relative">
            <Sidebar variant="mobile" />
          </div>
        </div>
      )}
    </div>
  );
};

export default AppLayout;
