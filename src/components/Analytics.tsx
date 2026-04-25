import { Analytics } from '@vercel/analytics/react';

interface AnalyticsProps {
  mode?: 'production' | 'development' | 'all';
}

const VercelAnalytics = ({ mode = 'production' }: AnalyticsProps) => {
  // Simple, reliable logic for when to render Analytics
  const shouldRender = 
    mode === 'all' || 
    (mode === 'production' && import.meta.env.PROD) ||
    (mode === 'development' && !import.meta.env.PROD);

  // Don't render if conditions aren't met
  if (!shouldRender) {
    return null;
  }

  // Render Vercel Analytics - it automatically handles page tracking
  return <Analytics />;
};

export default VercelAnalytics;
