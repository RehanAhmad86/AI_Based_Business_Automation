import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';


export default function MainLayout() {
  return (
    <div className="font-sans antialiased text-gray-700 bg-gray-50">
      <Navbar />
      <main><Outlet /></main>
      <Footer />
    </div>
  );
}