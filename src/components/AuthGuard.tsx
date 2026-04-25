import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGame } from '@/context/GameContext';
import { supabase } from '@/lib/supabase';

interface AuthGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
}

const AuthGuard = ({ children, redirectTo = '/signin' }: AuthGuardProps) => {
  const { currentUser } = useGame();
  const navigate = useNavigate();
  const location = useLocation();

  // Check both GameContext and Supabase auth state
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session && !currentUser && location.pathname !== redirectTo) {
        navigate(redirectTo, { 
          state: { from: location.pathname },
          replace: true 
        });
      }
    };

    checkAuth();
  }, [currentUser, navigate, redirectTo, location]);

  // Always render children for now (temporary fix)
  return <>{children}</>;
};

export default AuthGuard;
