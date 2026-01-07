import { Routes, Route } from 'react-router-dom';
import { CleanerAuthProvider, ProtectedRoute } from './contexts/CleanerAuthContext';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Home from './pages/Home/Home';
import Apply from './pages/Apply/Apply';
import OurTeam from './pages/OurTeam/OurTeam';
import CleanerLogin from './pages/Cleaner/CleanerLogin';
import ForgotPassword from './pages/Cleaner/ForgotPassword';
import ResetPassword from './pages/Cleaner/ResetPassword';
import CleanerDashboard from './pages/CleanerDashboard/CleanerDashboard';

function App() {
  return (
    <CleanerAuthProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow pt-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/apply" element={<Apply />} />
            <Route path="/our-team" element={<OurTeam />} />
            
            {/* Cleaner Auth Routes */}
            <Route path="/cleaner/login" element={<CleanerLogin />} />
            <Route path="/cleaner/forgot-password" element={<ForgotPassword />} />
            <Route path="/cleaner/reset-password/:token" element={<ResetPassword />} />
            
            {/* Protected Cleaner Dashboard Route */}
            <Route path="/cleaner/dashboard" element={
              <ProtectedRoute>
                <CleanerDashboard />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
        <Footer />
      </div>
    </CleanerAuthProvider>
  );
}

export default App;