import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import { APP_ROUTES } from "./APP_ROUTES";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";
import Home from "../components/Home/Home";
import About from "../components/About/AboutPage";
import Portfolio from "../components/Portfolio/Portfolio";
import Clients from "../components/Clients/Clients";
import Blog from "../components/Blog/Blog";
import Contact from "../components/Contact/Contact";
import OrderList from "../components/Order/OrderList";
import ProductList from "../components/ProductList";
import AdminDashboardPage from "../pages/AdminDashboardPage";
import ProfilePage from "../pages/ProfilePage";
import CheckoutPage from "../pages/CheckoutPage";
import OrderTrackingPage from "../pages/OrderTrackingPage";
import ProtectedRoute from "./private/ProtectedRoute";
import GuestRoute from "./private/GuestRoute";
import Layout from "./Layout";

// Create router with nested routes
export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<Layout />}>
      <Route path={APP_ROUTES.login} element={<GuestRoute><LoginForm /></GuestRoute>} />
      <Route path={APP_ROUTES.register} element={<GuestRoute><RegisterForm /></GuestRoute>} />
      <Route path={APP_ROUTES.home} element={<Home />} />
      <Route path={APP_ROUTES.about} element={<About />} />
      <Route path={APP_ROUTES.portfolio} element={<Portfolio />} />
      <Route path={APP_ROUTES.client} element={<Clients />} />
      <Route path={APP_ROUTES.blog} element={<Blog />} />
      <Route path={APP_ROUTES.contact} element={<Contact />} />
      <Route path={APP_ROUTES.order} element={<OrderList />} />
      <Route path={APP_ROUTES.products} element={<ProductList />} />
      <Route path={APP_ROUTES.admin} element={<AdminDashboardPage />} />
      <Route
        path={APP_ROUTES.profile}
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path={APP_ROUTES.checkout}
        element={
          <ProtectedRoute>
            <CheckoutPage />
          </ProtectedRoute>
        }
      />
      <Route
        path={APP_ROUTES.orderTracking}
        element={
          <ProtectedRoute>
            <OrderTrackingPage />
          </ProtectedRoute>
        }
      />
    </Route>
  )
);