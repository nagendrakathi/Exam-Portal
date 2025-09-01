import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Modal from "./Modal";
import AuthForm from "./AuthForm";
import {useAuth} from "../context/AuthContext"

export default function Header() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("login");
  const navigate = useNavigate();

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-600 to-emerald-500 flex items-center justify-center text-white font-bold">
            LM
          </div>
          <div>
            <div className="text-lg font-semibold">LeadMasters</div>
            <div className="text-xs text-slate-500">Exam Portal</div>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            to="/dashboard"
            className="text-sm px-3 py-2 rounded-md hover:bg-slate-50"
          >
            Dashboard
          </Link>
          {user ? (
            <button
              onClick={logout}
              className="btn-sm bg-red-500 text-white px-3 py-2 rounded-md"
            >
              Logout
            </button>
          ) : (
            <>
              <button
                onClick={() => {
                  setMode("login");
                  setOpen(true);
                }}
                className="px-3 py-2 rounded-md border"
              >
                Login
              </button>
              <button
                onClick={() => {
                  setMode("register");
                  setOpen(true);
                }}
                className="px-3 py-2 rounded-md bg-teal-600 text-white"
              >
                Register
              </button>
            </>
          )}
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
