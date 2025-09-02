import Header from "./components/Header";
import LandingPage from "./pages/LandingPage";
import Exam from "./pages/Exam";
import Dashboard from "./pages/Dashboard";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import ExamResult from "./pages/ExamResult";

export default function App() {
  const { user } = useAuth();
  return (
    <div className="min-h-screen flex flex-col w-full">
      <Header />
      <main className="flex-1 w-full px-4 py-6">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/dashboard"
            element={user ? <Dashboard /> : <Navigate to="/" />}
          />
          <Route
            path="/exam/:sessionId"
            element={user ? <Exam /> : <Navigate to="/" />}
          />
          <Route
            path="/exam/:sessionId/result"
            element={user ? <ExamResult /> : <Navigate to="/" />}
          />
        </Routes>
      </main>
    </div>
  );
}
