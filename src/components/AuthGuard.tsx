import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/context/GameContext';

interface AuthGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
}

const AuthGuard = ({ children, redirectTo = '/signin' }: AuthGuardProps) => {
  const { currentUser } = useGame();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate(redirectTo);
    }
  }, [currentUser, navigate, redirectTo]);

  // If user is not authenticated, render nothing while redirecting
  if (!currentUser) {
    return null;
  }

  // If user is authenticated, render children
  return <>{children}</>;
};

export default AuthGuard;
