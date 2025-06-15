import Testimonials from "./components/Testimonials";
import FAQ from "./components/FAQ";
import CTA from "./components/CTA";
import Hero from "./components/Hero";
import TrustedBy from "./components/TrustedBy";
import Features from "./components/Features";
import HowItWorks from "./components/HowItWorks";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthLayout from "./auth/AuthLayout";
import MainLayout from "./components/MainLayout";
import SignInPage from "./auth/signin";
import SignUpPage from "./auth/signup";
import DashboardPreview from "./components/DashboardPreview";
import '@fortawesome/fontawesome-free/css/all.min.css';
import SalesPredictor from "./components/SalesPredictor";
import InvoiceScanner from "./pages/InvoiceScanner.jsx";
import BarcodeScanner from "./components/BarcodeScanner.jsx";
import ToneLetterAI from "./pages/ToneLetterAI.jsx";
import PrivateRoute from "./auth/PrivateRoute";
import FloatingChatBot from "./components/ChatBot.jsx";

export default function App() {
  function Home() {
  return (
    <>
      <Hero />
      <TrustedBy />
      <Features />
      <HowItWorks />
      <DashboardPreview />
      <Testimonials />
      <FAQ />
      <CTA />
      <FloatingChatBot />
    </>
  );
}
  return (
    <Router>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/auth/signin" element={<SignInPage />} />
          <Route path="/auth/signup" element={<SignUpPage />} />
        </Route>

        <Route path="/sales-predict" element={<PrivateRoute><SalesPredictor /></PrivateRoute>} />
        <Route path="/invoice-scanner" element={<PrivateRoute><InvoiceScanner /></PrivateRoute>} />
        <Route path="/barcode-scanner" element={<PrivateRoute><BarcodeScanner /></PrivateRoute>} />
        <Route path="/tone-email" element={<PrivateRoute><ToneLetterAI /></PrivateRoute>} />

        <Route element={<MainLayout />}>
          <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
          <Route path="/dashboard" element={<PrivateRoute><DashboardPreview /></PrivateRoute>} />
        </Route>
      </Routes>
    </Router>
  );
}
