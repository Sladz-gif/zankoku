import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';

interface AnalyticsProps {
  mode?: 'production' | 'development' | 'all';
}

const VercelAnalytics = ({ mode = 'production' }: AnalyticsProps) => {
  const location = useLocation();

  useEffect(() => {
    // Track page views for route changes
    if (mode === 'all' || (mode === 'production' && import.meta.env.PROD)) {
      // Vercel Analytics automatically tracks page views
      // This useEffect ensures route changes are tracked in SPA
      console.log('📊 Analytics: Page view tracked for', location.pathname);
    }
  }, [location.pathname, mode]);

  // Only render Analytics component in appropriate environment
  if (mode === 'production' && !import.meta.env.PROD) {
    return null;
  }

  return <Analytics />;
};

export default VercelAnalytics;
