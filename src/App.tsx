import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { GameProvider } from "@/context/GameContext";
import AppLayout from "@/components/layout/AppLayout";
import AuthGuard from "@/components/AuthGuard";
import Landing from "./pages/Landing";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import ForgotPassword from "./pages/ForgotPassword";
import DashboardPlaceholder from "./pages/DashboardPlaceholder";
import Feed from "./pages/Feed";
import Profile from "./pages/Profile";
import Clans from "./pages/Clans";
import BattleLobby from "./pages/BattleLobby";
import Bounties from "./pages/Bounties";
import Store from "./pages/Store";
import Checkout from "./pages/Checkout";
import MangaLibrary from "./pages/MangaLibrary";
import MangaReader from "./pages/MangaReader";
import ResourceStore from "./pages/ResourceStore";
import Leaderboard from "./pages/Leaderboard";
import DotWarsGame from "./pages/DotWarsGame";
import MessagesPage from "./pages/MessagesPage";
import Notifications from "./pages/Notifications";
import PostDetail from "./pages/PostDetail";
import BetPage from "./pages/BetPage";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import CookiePolicy from "./pages/CookiePolicy";
import CommunityGuidelines from "./pages/CommunityGuidelines";
import Support from "./pages/Support";
import NotFound from "./pages/NotFound";
import AnimeNews from "./pages/AnimeNews";
import { useEffect } from "react";
import { useSupportPopup } from "@/hooks/useSupportPopup";
import SupportSection from "@/components/SupportSection";
import SupportPopup from "@/components/SupportPopup";

const queryClient = new QueryClient();

const ScrollToTopRouter = () => {
  const location = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return null;
};

const App = () => {
  const { 
    showPopup, 
    showSupportSection, 
    handleSupportSectionClick, 
    handleCloseSupportSection,
    handleClosePopup
  } = useSupportPopup();

  return (
    <QueryClientProvider client={queryClient}>
      <GameProvider>
        <BrowserRouter>
          <ScrollToTopRouter />
          <AppLayout>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/dashboard" element={<DashboardPlaceholder />} />
              
              {/* Public Information Pages */}
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/cookies" element={<CookiePolicy />} />
              <Route path="/guidelines" element={<CommunityGuidelines />} />
              <Route path="/support" element={<Support />} />
              
              {/* Authenticated Routes */}
              <Route path="/feed" element={
                <AuthGuard>
                  <Feed />
                </AuthGuard>
              } />
              <Route path="/feed/post/:id" element={
                <AuthGuard>
                  <PostDetail />
                </AuthGuard>
              } />
              <Route path="/post/:id" element={
                <AuthGuard>
                  <PostDetail />
                </AuthGuard>
              } />
              <Route path="/profile" element={
                <AuthGuard>
                  <Profile />
                </AuthGuard>
              } />
              <Route path="/clans" element={
                <AuthGuard>
                  <Clans />
                </AuthGuard>
              } />
              <Route path="/battle" element={
                <AuthGuard>
                  <BattleLobby />
                </AuthGuard>
              } />
              <Route path="/bounties" element={
                <AuthGuard>
                  <Bounties />
                </AuthGuard>
              } />
              <Route path="/store" element={
                <AuthGuard>
                  <Store />
                </AuthGuard>
              } />
              <Route path="/checkout" element={
                <AuthGuard>
                  <Checkout />
                </AuthGuard>
              } />
              <Route path="/manga" element={
                <AuthGuard>
                  <MangaLibrary />
                </AuthGuard>
              } />
              <Route path="/manga/series/:id" element={
                <AuthGuard>
                  <MangaReader />
                </AuthGuard>
              } />
              <Route path="/store/resources" element={
                <AuthGuard>
                  <ResourceStore />
                </AuthGuard>
              } />
              <Route path="/leaderboard" element={
                <AuthGuard>
                  <Leaderboard />
                </AuthGuard>
              } />
              <Route path="/game" element={
                <AuthGuard>
                  <DotWarsGame />
                </AuthGuard>
              } />
              <Route path="/messages" element={
                <AuthGuard>
                  <MessagesPage />
                </AuthGuard>
              } />
              <Route path="/messages/:userId" element={
                <AuthGuard>
                  <MessagesPage />
                </AuthGuard>
              } />
              <Route path="/bet/:battleId" element={
                <AuthGuard>
                  <BetPage />
                </AuthGuard>
              } />
              <Route path="/notifications" element={
                <AuthGuard>
                  <Notifications />
                </AuthGuard>
              } />
              <Route path="/anime-news" element={
                <AuthGuard>
                  <AnimeNews />
                </AuthGuard>
              } />
              
              {/* Fallback */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppLayout>
          {/* Support Components */}
          {showPopup && <SupportPopup onClose={handleClosePopup} />}
          {showSupportSection && (
            <SupportSection 
              onClick={handleSupportSectionClick} 
              onClose={handleCloseSupportSection} 
            />
          )}
        </BrowserRouter>
      </GameProvider>
    </QueryClientProvider>
  );
};

export default App;
