
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Header from './components/Header';
import Footer from './components/Footer';
import AnnouncementBar from './components/AnnouncementBar';
import Home from './pages/Home';
import DonateFlow from './pages/DonateFlow';
import { AboutPage, WorkPage, GalleryPage, PartnersPage, ImpactPage, BlogPage, VolunteerPage, InternshipPage, VolunteerSignupPage, InternshipSignupPage, PrivacyPage, TermsPage, RefundPage } from './pages/ContentPages';
import { AdminLogin, AdminDashboard } from './pages/AdminPages';
import { ContributorPortal } from './pages/ContributorPortal';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Loader2 } from 'lucide-react';
import ErrorBoundary from './components/ErrorBoundary';
import FloatingDonateButton from './components/FloatingDonateButton';

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const attemptScroll = (count: number) => {
        const element = document.getElementById(hash.replace('#', ''));
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        } else if (count < 10) {
          setTimeout(() => attemptScroll(count + 1), 100);
        }
      };
      setTimeout(() => attemptScroll(0), 50);
    } else {
      window.scrollTo(0, 0);
    }
    // Per-page <title>/meta description are now handled by the <SEO> component
    // on each page (via react-helmet-async) instead of the switch statement
    // that used to live here — that only covered a handful of routes and
    // couldn't set descriptions/canonical/OG tags at all.
  }, [pathname, hash]);
  return null;
};

// Security Guard Component
const ProtectedRoute = ({ children }: { children?: React.ReactNode }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
      return (
          <div className="h-screen flex items-center justify-center bg-brand-light">
              <Loader2 className="animate-spin h-10 w-10 text-brand-blue" />
          </div>
      );
  }

  if (!user) {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
};

const App = () => {
  const { pathname } = useLocation();
  // Hide header/footer for admin routes
  const isAdminRoute = pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen font-sans text-gray-900 relative">
      {!isAdminRoute && <AnnouncementBar />}
      {!isAdminRoute && <Header />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/donate" element={<DonateFlow />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/work" element={<WorkPage />} />
          <Route path="/impact" element={<ImpactPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/volunteer" element={<VolunteerPage />} />
          <Route path="/internship" element={<InternshipPage />} />
          <Route path="/volunteer-signup" element={<VolunteerSignupPage />} />
          <Route path="/internship-signup" element={<InternshipSignupPage />} />
          <Route path="/portal" element={<ContributorPortal />} />
          <Route path="/internship-portal" element={<ContributorPortal portalType="internship" />} />
          <Route path="/volunteer-portal" element={<ContributorPortal portalType="volunteer" />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/partners" element={<PartnersPage />} />
          <Route path="/contact" element={<PartnersPage />} />
          
          {/* Legal Pages */}
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/refund" element={<RefundPage />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
      {!isAdminRoute && <FloatingDonateButton />}
      {!isAdminRoute && <Footer />}
    </div>
  );
};

const AppWrapper = () => (
  <ErrorBoundary>
    <HelmetProvider>
      <AuthProvider>
        <Router>
          <ScrollToTop />
          <App />
        </Router>
      </AuthProvider>
    </HelmetProvider>
  </ErrorBoundary>
);

export default AppWrapper;
