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
import "@fortawesome/fontawesome-free/css/all.min.css";
import SalesPredictor from "./components/SalesPredictor";
import InvoiceScanner from "./pages/InvoiceScanner.jsx";
import BarcodeScanner from "./components/BarcodeScanner.jsx";
import ToneLetterAI from "./pages/ToneLetterAI.jsx";
import PrivateRoute from "./auth/PrivateRoute";
import FloatingChatBot from "./components/ChatBot.jsx";
import { SalesAnalyticsDashboard } from "./pages/sales-analytics.jsx";
import InvoiceGenerator from "./components/invoice/InvoiceGenerator.jsx";
import InventoryDashboard from "./pages/inventoryDashboard.jsx";
import AddInventory from "./pages/AddInventory.jsx";
import InventoryDetail from "./pages/InventoryDetail.jsx";
import EditInventory from "./pages/EditInventory.jsx";
import OrderManagement from "./pages/OrderManagement.jsx";

export default function App() {
  function Home() {
    return (
      <>
        <Hero />
        {/* <TrustedBy /> */}
        <Features />
        <HowItWorks />
        <DashboardPreview />
        {/* <Testimonials /> */}
        {/* <FAQ /> */}
        {/* <CTA /> */}
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
        <Route
          path="/sales-predict"
          element={
            <PrivateRoute>
              <SalesPredictor />
            </PrivateRoute>
          }
        />
        <Route
          path="/invoice-scanner"
          element={
            <PrivateRoute>
              <InvoiceScanner />
            </PrivateRoute>
          }
        />
        <Route
          path="/barcode-scanner"
          element={
            <PrivateRoute>
              <BarcodeScanner />
            </PrivateRoute>
          }
        />
        <Route
          path="/tone-email"
          element={
            <PrivateRoute>
              <ToneLetterAI />
            </PrivateRoute>
          }
        />
        <Route
          path="/invoice-generator"
          element={
            <PrivateRoute>
              <InvoiceGenerator />
            </PrivateRoute>
          }
        />
        <Route
          path="/inventory"
          element={
            <PrivateRoute>
              <InventoryDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/inventory/add"
          element={
            <PrivateRoute>
              <AddInventory />
            </PrivateRoute>
          }
        />
        <Route
          path="/inventory/:id"
          element={
            <PrivateRoute>
              <InventoryDetail />
            </PrivateRoute>
          }
        />
        <Route
          path="/inventory/edit/:id"
          element={
            <PrivateRoute>
              <EditInventory />
            </PrivateRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <PrivateRoute>
              <OrderManagement />
            </PrivateRoute>
          }
        />
        <Route element={<MainLayout />}>
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/sales-analytics"
            element={
              <PrivateRoute>
                <SalesAnalyticsDashboard />
              </PrivateRoute>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
}
