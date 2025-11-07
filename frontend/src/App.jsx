
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { fetchCurrentUser } from "./store/authSlice"
import LoginForm from "./components/LoginForm"
import RegisterForm from "./components/RegisterForm"
import HomePage from "./pages/HomePage"
import CheckoutPage from "./pages/CheckoutPage"
import OrderTrackingPage from "./pages/OrderTrackingPage"
import AdminDashboardPage from "./pages/AdminDashboardPage"
import Navbar from "./components/Home/Header/Navbar"
import Footer from "./components/Footer/Footer"
import Home from "./components/Home/Home"
import About from "./components/About/AboutPage"
import Portfolio from "./components/Portfolio/Portfolio"
import Clients from "./components/Clients/Clients"
import Blog from "./components/Blog/Blog"
import Contact from "./components/Contact/Contact"
import OrderList from "./components/Order/OrderList"

function ProtectedRoute({ children, requiredRole }) {
  const { isAuthenticated, user } = useSelector((state) => state.auth)

  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" />
  }

  return children
}

export default function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    const token = localStorage.getItem("accessToken")
    if (token) {
      dispatch(fetchCurrentUser())
    }
  }, [dispatch])

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/client" element={<Clients />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/order" element={<OrderList />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/order/:orderId"
          element={
            <ProtectedRoute>
              <OrderTrackingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Footer />
    </Router>
  )
}
