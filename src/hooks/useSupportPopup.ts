import { useState, useEffect, useRef } from 'react';
import SupportPopup from '../components/SupportPopup';
import { supabase } from '../lib/supabase';

export const useSupportPopup = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [showSupportSection, setShowSupportSection] = useState(false);
  const signupTimeRef = useRef<number | null>(null);
  const hasShownPopupRef = useRef(false);
  const hasShownSectionRef = useRef(false);

  useEffect(() => {
    // Check if user just signed up (look for recent auth or profile creation)
    const checkRecentSignup = () => {
      const signupTime = sessionStorage.getItem('zankoku_signup_time');
      if (signupTime) {
        signupTimeRef.current = parseInt(signupTime);
        return true;
      }
      return false;
    };

    // Set signup time if user just authenticated
    const setSignupTime = () => {
      const now = Date.now();
      sessionStorage.setItem('zankoku_signup_time', now.toString());
      signupTimeRef.current = now;
    };

    // Check for recent signup by looking at Supabase session
    const checkAuthState = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      // Only set signup time if user is authenticated
      if (session && !checkRecentSignup()) {
        setSignupTime();
      }
    };

    // Initial auth check
    checkAuthState();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session && !checkRecentSignup()) {
        setSignupTime();
      }
    });

    const checkTime = () => {
      if (!signupTimeRef.current) return;

      const currentTime = Date.now();
      const timeSinceSignup = currentTime - signupTimeRef.current;
      const timeInMinutes = timeSinceSignup / (1000 * 60);

      // Show popup after 1.5 minutes from signup
      if (timeInMinutes >= 1.5 && !hasShownPopupRef.current) {
        setShowPopup(true);
        hasShownPopupRef.current = true;
      }

      // Show support section after 2 minutes from signup
      if (timeInMinutes >= 2 && !hasShownSectionRef.current) {
        setShowSupportSection(true);
        hasShownSectionRef.current = true;
      }
    };

    // Check every 10 seconds
    const interval = setInterval(checkTime, 10000);

    // Initial check
    checkTime();

    return () => {
      clearInterval(interval);
      subscription.unsubscribe();
    };
  }, []);

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleSupportSectionClick = () => {
    setShowPopup(true);
  };

  const handleCloseSupportSection = () => {
    setShowSupportSection(false);
  };

  return { 
    showPopup, 
    setShowPopup,
    showSupportSection,
    setShowSupportSection,
    handleSupportSectionClick,
    handleCloseSupportSection,
    handleClosePopup
  };
};
