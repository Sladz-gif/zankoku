import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { GameProvider } from "@/context/GameContext";
import AppLayout from "@/components/layout/AppLayout";
import AuthGuard from "@/components/AuthGuard";
import VercelAnalytics from "@/components/Analytics";
import Landing from "./pages/Landing";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import ForgotPassword from "./pages/ForgotPassword";
import DashboardPlaceholder from "./pages/DashboardPlaceholder";
import Dojo from "./pages/Dojo";
import Feed from "./pages/Feed";
import Demo from "./pages/Demo";
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
import TutorialBasicCombat from "./pages/TutorialBasicCombat";
import TutorialAdvancedStrategies from "./pages/TutorialAdvancedStrategies";
import TutorialFightingStyles from "./pages/TutorialFightingStyles";
import TutorialClanWarfare from "./pages/TutorialClanWarfare";
import TutorialPowerMoves from "./pages/TutorialPowerMoves";
import TutorialTournamentPrep from "./pages/TutorialTournamentPrep";
import { useEffect } from "react";
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
  return (
    <>
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
              <Route path="/demo" element={
                <AuthGuard>
                  <Demo />
                </AuthGuard>
              } />
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
              <Route path="/battle-lobby" element={
                <AuthGuard>
                  <BattleLobby />
                </AuthGuard>
              } />
              <Route path="/dojo" element={
                <AuthGuard>
                  <Dojo />
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
              
              {/* Tutorial Routes */}
              <Route path="/tutorial/basic-combat" element={
                <AuthGuard>
                  <TutorialBasicCombat />
                </AuthGuard>
              } />
              <Route path="/tutorial/advanced-strategies" element={
                <AuthGuard>
                  <TutorialAdvancedStrategies />
                </AuthGuard>
              } />
              <Route path="/tutorial/fighting-styles" element={
                <AuthGuard>
                  <TutorialFightingStyles />
                </AuthGuard>
              } />
              <Route path="/tutorial/clan-warfare" element={
                <AuthGuard>
                  <TutorialClanWarfare />
                </AuthGuard>
              } />
              <Route path="/tutorial/power-moves" element={
                <AuthGuard>
                  <TutorialPowerMoves />
                </AuthGuard>
              } />
              <Route path="/tutorial/tournament-prep" element={
                <AuthGuard>
                  <TutorialTournamentPrep />
                </AuthGuard>
              } />
              
              {/* Fallback */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppLayout>
        </BrowserRouter>
        </GameProvider>
      </QueryClientProvider>
      <VercelAnalytics mode="production" />
    </>
  );
};

export default App;
