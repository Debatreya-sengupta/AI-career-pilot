import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/AppLayout'
import { ProtectedRoute } from './components/ProtectedRoute'
import { Login } from './pages/Login'
import { Signup } from './pages/Signup'
import { DashboardHome } from './pages/DashboardHome'
import { Account } from './pages/Account'
import { AtsChecker } from './pages/AtsChecker'
import { JobMatch } from './pages/JobMatch'
import { MarketSkills } from './pages/MarketSkills'
import { Interview } from './pages/Interview'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<DashboardHome />} />
          <Route path="/account" element={<Account />} />
          <Route path="/ats" element={<AtsChecker />} />
          <Route path="/job-match" element={<JobMatch />} />
          <Route path="/market-skills" element={<MarketSkills />} />
          <Route path="/interview" element={<Interview />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

