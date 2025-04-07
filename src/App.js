import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";

import "./i18n";
import AdminLogin from "./admin/AdminLogin";
import AdminDashboard from "./admin/AdminDashboard";
import Layout from "./Layout";
import Home from './home/Home';
import PrivacyPolicy from './shared/components/PrivacyPolicy';
import './App.css'



function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);


  return (
    <Router>
      {/* <ScrollToTop /> */}
      <Routes>
        {/* Müşteri Sayfaları (Navbar dahil) */}
        <Route path="/" element={<Layout />}>
          <Route exact index element={<Home />} />

        </Route>
        <Route exact path="/privacy-policy" element={<PrivacyPolicy />} />
        {/* Admin Sayfaları (Navbar yok) */}
        <Route exact path="/admin/login" element={isLoggedIn ? <Navigate to="/admin/dashboard" /> : <AdminLogin onLogin={handleLogin} />} />
        <Route exact path="/admin/dashboard" element={isLoggedIn ? <AdminDashboard /> : <Navigate to="/admin/login" />} />

      </Routes>
    </Router>
  )
}

export default App