import { useEffect } from 'react';
import { Analytics } from '@vercel/analytics/react';

interface AnalyticsProps {
  mode?: 'production' | 'development' | 'all';
}

const VercelAnalytics = ({ mode = 'production' }: AnalyticsProps) => {
  useEffect(() => {
    // Log analytics status for debugging
    const isProd = import.meta.env.PROD;
    const shouldRender = mode === 'all' || (mode === 'production' && isProd) || (mode === 'development' && !isProd);
    
    console.log('📊 Analytics Status:', {
      mode,
      isProd,
      shouldRender,
      environment: import.meta.env.MODE
    });

    if (shouldRender) {
      console.log('✅ Vercel Analytics is active and tracking');
    }
  }, [mode]);

  // Only render Analytics component in appropriate environment
  if (mode === 'production' && !import.meta.env.PROD) {
    console.log('📊 Analytics: Disabled in development (production mode)');
    return null;
  }

  if (mode === 'development' && import.meta.env.PROD) {
    console.log('📊 Analytics: Disabled in production (development mode)');
    return null;
  }

  // Vercel Analytics automatically tracks page views in SPAs
  console.log('📊 Analytics: Rendering Vercel Analytics component');
  return <Analytics />;
};

export default VercelAnalytics;
