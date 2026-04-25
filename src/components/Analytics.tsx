import { Analytics } from '@vercel/analytics/react';

interface AnalyticsProps {
  mode?: 'production' | 'development' | 'all';
}

const VercelAnalytics = ({ mode = 'production' }: AnalyticsProps) => {
  // Only render Analytics component in appropriate environment
  if (mode === 'production' && !import.meta.env.PROD) {
    return null;
  }

  // Vercel Analytics automatically tracks page views in SPAs
  // No need for manual tracking with useLocation
  return <Analytics />;
};

export default VercelAnalytics;
