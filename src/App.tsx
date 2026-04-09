import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import RankingPage from "./pages/RankingPage";
import GamesPage from "./pages/GamesPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import ConjugationsPage from "./pages/ConjugationsPage";
import SmartReviewPage from "./pages/SmartReviewPage";
import OnboardingPage from "./pages/OnboardingPage";
import AchievementsPage from "./pages/AchievementsPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import BlogPage from "./pages/BlogPage";
import BlogPostPage from "./pages/BlogPostPage";
import AdminBlogPage from "./pages/AdminBlogPage";
import AdminBlogEditorPage from "./pages/AdminBlogEditorPage";
import NotFound from "./pages/NotFound";
import ChatbotWidget from "./components/ChatbotWidget";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/conjugations" element={<ConjugationsPage />} />
            <Route path="/conjugations/review" element={<SmartReviewPage />} />
            <Route path="/conjugations/onboarding" element={<OnboardingPage />} />
            <Route path="/achievements" element={<AchievementsPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/ranking" element={<RankingPage />} />
            <Route path="/games/:mode" element={<GamesPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
            <Route path="/admin/blog" element={<AdminBlogPage />} />
            <Route path="/admin/blog/new" element={<AdminBlogEditorPage />} />
            <Route path="/admin/blog/edit/:id" element={<AdminBlogEditorPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
