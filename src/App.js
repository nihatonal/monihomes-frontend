import React, { useState } from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";

import "./i18n";
import AdminLogin from "./admin/components/AdminLogin";
import AdminDashboard from "./admin/components/AdminDashboard";
import Layout from "./Layout";
import Home from './home/Home';

import './App.css'



function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  const handleLogin = () => {
    setIsLoggedIn(true);
  };


  return (
    <Router>
      {/* <ScrollToTop /> */}
      <Routes>
        {/* Müşteri Sayfaları (Navbar dahil) */}
        <Route path="/" element={<Layout />}>
          <Route exact index element={<Home />} />
        </Route>
        {/* Admin Sayfaları (Navbar yok) */}
        <Route exact path="/admin/login" element={isLoggedIn ? <Navigate to="/admin/dashboard" /> : <AdminLogin onLogin={handleLogin} />} />
        <Route exact path="/admin/dashboard" element={isLoggedIn ? <AdminDashboard /> : <Navigate to="/admin/login" />} />

      </Routes>
    </Router>
  )
}

export default App