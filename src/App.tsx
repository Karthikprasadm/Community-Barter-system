
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BarterProvider } from "@/context/BarterContext";
import Index from "./pages/Index";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Login from "./pages/Auth/Login";
import AdminLogin from "./pages/Auth/AdminLogin";
import Register from "./pages/Auth/Register";
import Marketplace from "./pages/Marketplace";
import MyItems from "./pages/MyItems";
import Offers from "./pages/Offers";
import ItemDetail from "./pages/ItemDetail";
import AdminDashboard from "./pages/Admin/Dashboard";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BarterProvider>
      <ErrorBoundary>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/admin-login" element={<AdminLogin />} />
<Route path="/profile" element={<Profile />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/my-items" element={<MyItems />} />
              <Route path="/offers" element={<Offers />} />
              <Route path="/items/:itemId" element={<ItemDetail />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ErrorBoundary>
    </BarterProvider>
  </QueryClientProvider>
);

export default App;
