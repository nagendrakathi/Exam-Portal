import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Modal from "./Modal";
import AuthForm from "./AuthForm";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("login");
  const navigate = useNavigate();
  const location = useLocation();

  const examPathMatch = location.pathname.match(/^\/exam\/\w+/);
  const examResultMatch = location.pathname.match(/^\/exam\/\w+\/result$/);

  const handleDashboardClick = (e) => {
    if (!user) {
      e.preventDefault();
      setMode("login");
      setOpen(true);
      return;
    }

    if (examPathMatch) {
      e.preventDefault();
      alert("Submit the exam to go to Dashboard");
      return;
    }

    navigate("/dashboard");
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="w-full mx-auto px-5 py-3 md:px-10 flex items-center justify-between">
        <div className="flex items-center gap-2 ">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-600 to-emerald-500 flex items-center justify-center text-white font-bold">
            <img src="/image.png" alt="logo" className="w-10 h-10" />
          </div>
          <div>
            <div className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-purple-500 ">
              Quiz Master
            </div>
            <div className="text-xs text-slate-500">Exam Portal</div>
          </div>
        </div>

        <div className="flex items-center justify-start gap-3">
          {(!examPathMatch || examResultMatch) &&
            (user ? (
              <div className="flex justify-center flex-col gap-1 text-slate-700">
                <span className="text-md">{user.name}</span>
                <button
                  onClick={logout}
                  className="underline text-red-600 hover:text-red-500/40 cursor-pointer text-sm"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => {
                    setMode("login");
                    setOpen(true);
                  }}
                  className="px-4 py-2 rounded-md bg-blue-600/90 text-white text-sm font-medium hover:bg-blue-700 transition cursor-pointer border-none"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    setMode("register");
                    setOpen(true);
                  }}
                  className="px-3 py-2 rounded-md bg-blue-600/90 text-white text-sm font-medium hover:bg-blue-700 transition cursor-pointer border-none"
                >
                  Register
                </button>
              </>
            ))}
        </div>
      </div>

      <Modal open={open} onClose={() => setOpen(false)}>
        <AuthForm
          mode={mode}
          switchMode={(m) => setMode(m)}
          close={() => setOpen(false)}
        />
      </Modal>
    </header>
  );
}
