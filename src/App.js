import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from "react-router-dom";

import "./i18n";
import AdminLogin from "./admin/AdminLogin";
import AdminDashboard from "./admin/AdminDashboard";
import Layout from "./Layout";
import PrivacyPolicy from './shared/components/PrivacyPolicy';
import PageTracking from './shared/utility/PageTracking';
import RoomInstructions from './shared/components/RoomInstructions';
import './App.css'
import { useTranslation } from 'react-i18next';
import { languageRoutes, supportedLanguages } from './config/routes';
const Home = React.lazy(() => import('./home/Home'));


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const LanguageDetector = () => {
    const location = useLocation();
    const { i18n } = useTranslation();

    useEffect(() => {
      const pathLang = location.pathname.split("/")[1]; // "tr", "en", "ru"
      if (["tr", "en", "ru"].includes(pathLang)) {
        i18n.changeLanguage(pathLang);
      }
    }, [location.pathname, i18n]);

    return null;
  };


  return (
    <Router>
      <LanguageDetector />
      {/* <ScrollToTop /> */}
      <PageTracking />
      <Routes>
        {/* Müşteri Sayfaları (Navbar dahil) */}
        <Route path="/" element={<Layout />}>
          <Route exact index element={<Home />} />
        </Route>
        {/* Çok dilli sayfalar */}
        {languageRoutes.map((route) =>
          supportedLanguages.map((lng) => (
            <Route
              key={`${route.key}-${lng}`}
              path={route.paths[lng]}
              element={route.element}
            />
          ))
        )}
        <Route exact path="/privacy-policy" element={<PrivacyPolicy />} />

        {/* Admin Sayfaları (Navbar yok) */}
        <Route exact path="/admin/login" element={isLoggedIn ? <Navigate to="/admin/dashboard" /> : <AdminLogin onLogin={handleLogin} />} />
        <Route exact path="/admin/dashboard" element={isLoggedIn ? <AdminDashboard /> : <Navigate to="/admin/login" />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App