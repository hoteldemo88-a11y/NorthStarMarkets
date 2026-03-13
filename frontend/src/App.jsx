import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './layout/MainLayout'
import DashboardLayout from './layout/DashboardLayout'
import Home from './pages/Home'
import About from './pages/About'
import OurGoal from './pages/OurGoal'
import ClientsReviews from './pages/ClientsReviews'
import Markets from './pages/Markets'
import Faq from './pages/Faq'
import Careers from './pages/Careers'
import Contact from './pages/Contact'
import Login from './pages/Login'
import OpenAccount from './pages/OpenAccount'
import ClientDashboard from './pages/ClientDashboard'
import ClientKYC from './pages/ClientKYC'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import AdminUsers from './pages/AdminUsers'
import AdminDeposits from './pages/AdminDeposits'
import AdminWithdrawals from './pages/AdminWithdrawals'
import AdminTrades from './pages/AdminTrades'
import AdminActivityLogs from './pages/AdminActivityLogs'
import AdminSettings from './pages/AdminSettings'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="our-goal" element={<OurGoal />} />
          <Route path="clients-reviews" element={<ClientsReviews />} />
          <Route path="markets" element={<Markets />} />
          <Route path="faq" element={<Faq />} />
          <Route path="careers" element={<Careers />} />
          <Route path="contact" element={<Contact />} />
          <Route path="login" element={<Login />} />
          <Route path="open-account" element={<OpenAccount />} />
        </Route>

        <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route index element={<ClientDashboard />} />
          <Route path="kyc" element={<ClientKYC />} />
        </Route>

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminRoute><DashboardLayout /></AdminRoute>}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="deposits" element={<AdminDeposits />} />
          <Route path="withdrawals" element={<AdminWithdrawals />} />
          <Route path="trades" element={<AdminTrades />} />
          <Route path="activity-logs" element={<AdminActivityLogs />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
