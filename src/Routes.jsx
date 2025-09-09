import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import PatientPortal from './pages/patient-portal';
import DoctorDashboard from './pages/doctor-dashboard';
import AdminAnalytics from './pages/admin-analytics';
import LoginPage from './pages/login';
import PharmacyDashboard from './pages/pharmacy-dashboard';
import PatientProfile from './pages/patient-profile';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<AdminAnalytics />} />
        <Route path="/patient-portal" element={<PatientPortal />} />
        <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
        <Route path="/admin-analytics" element={<AdminAnalytics />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/pharmacy-dashboard" element={<PharmacyDashboard />} />
        <Route path="/patient-profile" element={<PatientProfile />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
