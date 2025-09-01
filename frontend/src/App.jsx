import Header from "./components/Header";
import LandingPage from "./pages/LandingPage";
import Exam from "./pages/Exam";
import Dashboard from "./pages/Dashboard";
import { Routes, Route } from "react-router-dom";
export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-lg w-full mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/exam/:sessionId" element={<Exam />} />
        </Routes>
      </main>
    </div>
  );
}
