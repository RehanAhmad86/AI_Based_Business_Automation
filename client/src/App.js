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
import ChatBot from "./components/ChatBot";
import SalesPredictor from "./components/SalesPredictor";
import InvoiceScanner from "./pages/InvoiceScanner.jsx";
import BarcodeScanner from "./components/BarcodeScanner.jsx";
import BarcodeReader from "./pages/BarcodeReader.jsx";
import ToneLetterAI from "./pages/ToneLetterAI.jsx";


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
    </>
  );
}
export default function App() {
  return (
    <Router>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/auth/signin" element={<SignInPage />} />
          <Route path="/auth/signup" element={<SignUpPage />} />
        </Route>

        <Route path="/chatbot" element={<ChatBot />} />
        <Route path="/sales-predict" element={<SalesPredictor />} />
        <Route path="/invoice-scanner" element={<InvoiceScanner />} />
        <Route path="/barcode-scanner" element={<BarcodeScanner />} />
        <Route path="/barcode-reader" element={<BarcodeReader />} />
        <Route path="/tone-email" element={<ToneLetterAI />} />

        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<DashboardPreview />} />
        </Route>
      </Routes>
    </Router>
  );
}