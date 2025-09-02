import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Modal from "../components/Modal";
import AuthForm from "../components/AuthForm";

export default function LandingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("login");

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  return (
    <main className="min-h-screen w-full">
      <section className="mx-auto my-5 max-w-7xl px-4 py-24 md:py-32 flex flex-col items-center text-center">
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/70 px-3 py-1 text-xs text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-purple-500  backdrop-blur">
          <span className="inline-block h-2 w-2 rounded-full bg-blue-500 " />
          Secure online exams
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900">
          Welcome to{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-purple-500 ">
            Quiz Master
          </span>
        </h1>

        <p className="mt-4 max-w-2xl text-base md:text-lg text-gray-700">
          A simple way to take proctored exams, track progress, and enhance
          skills—anytime, anywhere.
        </p>

        <div className="mt-8 flex items-center gap-3">
          <button
            onClick={() => {
              setMode("login");
              setOpen(true);
            }}
            className="px-6 py-3 rounded-md bg-blue-600/90 text-white text-lg font-medium hover:bg-blue-700 transition cursor-pointer border-none"
          >
            Get Started
          </button>

          <button
            onClick={() => {
              setMode("register");
              setOpen(true);
            }}
            className="px-6 py-3 rounded-md border border-blue-200 text-blue-700 bg-white hover:bg-blue-50 transition cursor-pointer"
          >
            Create Account
          </button>
        </div>
      </section>
      <Modal open={open} onClose={() => setOpen(false)}>
        <AuthForm
          mode={mode}
          switchMode={(m) => setMode(m)}
          close={() => setOpen(false)}
        />
      </Modal>
    </main>
  );
}
