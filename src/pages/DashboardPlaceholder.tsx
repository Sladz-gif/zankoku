import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/context/GameContext';

const DashboardPlaceholder = () => {
  const { currentUser } = useGame();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect directly to feed
    navigate('/feed');
  }, [navigate]);

  // If somehow reached without auth context loaded (safeguard)
  if (!currentUser) {
    navigate('/signin');
    return null;
  }

  return (
    <div className="min-h-screen zankoku-bg flex items-center justify-center">
      <div className="text-white">Loading...</div>
    </div>
  );
};

export default DashboardPlaceholder;
