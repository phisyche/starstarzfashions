
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";
import HomePage from "@/pages/HomePage";
import ShopPage from "@/pages/ShopPage";
import Shop from "@/pages/Shop";
import ProductPage from "@/pages/ProductPage";
import AboutPage from "@/pages/AboutPage";
import ContactPage from "@/pages/ContactPage";
import Collections from "@/pages/Collections";
import CollectionPage from "@/pages/CollectionPage";
import CollectionDetail from "@/pages/CollectionDetail";
import AccountPage from "@/pages/AccountPage";
import CartPage from "@/pages/CartPage";
import CheckoutPage from "@/pages/CheckoutPage";
import OrderSuccessPage from "@/pages/OrderSuccessPage";
import FaqPage from "@/pages/FaqPage";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import Callback from "@/pages/auth/Callback";
import PrivacyPolicyPage from "@/pages/PrivacyPolicyPage";
import TermsPage from "@/pages/TermsPage";
import CategoryDetail from "@/pages/CategoryDetail";
import OrderConfirmationPage from "@/pages/OrderConfirmationPage";
import OrderDetailPage from "@/pages/OrderDetailPage";
import NotFoundPage from "@/pages/NotFoundPage";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminProducts from "@/pages/admin/AdminProducts";
import AdminAddProduct from "@/pages/admin/AdminAddProduct";
import AdminEditProduct from "@/pages/admin/AdminEditProduct";
import AdminOrders from "@/pages/admin/AdminOrders";
import AdminViewOrder from "@/pages/admin/AdminViewOrder";
import AdminCustomers from "@/pages/admin/AdminCustomers";
import AdminPayments from "@/pages/admin/AdminPayments";
import AdminSettings from "@/pages/admin/AdminSettings";
import AdminLogin from "@/pages/admin/AdminLogin";
import SupabaseSetupGuide from "@/pages/admin/SupabaseSetupGuide";
import "@/App.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
    errorElement: <NotFoundPage />
  },
  {
    path: "/home",
    element: <HomePage />,
  },
  {
    path: "/shop",
    element: <Shop />,
  },
  {
    path: "/shop/:category",
    element: <ShopPage />,
  },
  {
    path: "/product/:slug",
    element: <ProductPage />,
  },
  {
    path: "/about",
    element: <AboutPage />,
  },
  {
    path: "/contact",
    element: <ContactPage />,
  },
  {
    path: "/collections",
    element: <Collections />,
  },
  {
    path: "/collections/:slug",
    element: <CollectionPage />,
  },
  {
    path: "/collection/:slug",
    element: <CollectionDetail />,
  },
  {
    path: "/category/:slug",
    element: <CategoryDetail />,
  },
  {
    path: "/account",
    element: <AccountPage />,
  },
  {
    path: "/account/:tab",
    element: <AccountPage />,
  },
  {
    path: "/cart",
    element: <CartPage />,
  },
  {
    path: "/checkout",
    element: <CheckoutPage />,
  },
  {
    path: "/order/success",
    element: <OrderSuccessPage />,
  },
  // {
  //   path: "/order/confirmation/:id",
  //   element: <OrderConfirmationPage />,
  // },
  {
    path: "/order/:id",
    element: <OrderDetailPage />,
  },
  {
    path: "/faq",
    element: <FaqPage />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/auth/callback",
    element: <Callback />,
  },
  {
    path: "/privacy-policy",
    element: <PrivacyPolicyPage />,
  },
  {
    path: "/terms",
    element: <TermsPage />,
  },
  {
    path: "/admin",
    element: <AdminDashboard />,
  },
  {
    path: "/admin/products",
    element: <AdminProducts />,
  },
  {
    path: "/admin/products/add",
    element: <AdminAddProduct />,
  },
  {
    path: "/admin/products/edit/:id",
    element: <AdminEditProduct />,
  },
  {
    path: "/admin/orders",
    element: <AdminOrders />,
  },
  {
    path: "/admin/orders/:id",
    element: <AdminViewOrder />,
  },
  {
    path: "/admin/customers",
    element: <AdminCustomers />,
  },
  {
    path: "/admin/payments",
    element: <AdminPayments />,
  },
  {
    path: "/admin/settings",
    element: <AdminSettings />,
  },
  {
    path: "/admin/login",
    element: <AdminLogin />,
  },
  {
    path: "/admin/supabase-setup",
    element: <SupabaseSetupGuide />,
  },
  {
  path: "/admin/dashboard",
  element: <AdminDashboard />,
  },
  {
  path: "/order-confirmation",
  element: <OrderConfirmationPage />,
  },
  // {
  // path: "/order/confirmation/:id",
  // element: <OrderConfirmationPage />,
  // },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
