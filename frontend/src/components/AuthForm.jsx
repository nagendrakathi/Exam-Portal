import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function AuthForm({ mode = "login", switchMode, close }) {
  const { login, register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    let ok = false;
    if (mode === "login") ok = await login(email, password);
    else ok = await register(name, email, password);
    setLoading(false);
    if (ok) close();
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">
        {mode === "login" ? "Login" : "Register"}
      </h3>
      <form onSubmit={submit} className="space-y-3">
        {mode === "register" && (
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className="w-full p-2 border rounded"
          />
        )}
        <input
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded"
        />
        <input
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded"
        />
        <div className="flex items-center justify-between">
          <button
            className="px-4 py-2 bg-teal-600 text-white rounded"
            disabled={loading}
          >
            {loading
              ? "Please wait..."
              : mode === "login"
              ? "Login"
              : "Register"}
          </button>
          <button
            type="button"
            className="text-sm text-slate-500"
            onClick={() => switchMode(mode === "login" ? "register" : "login")}
          >
            {mode === "login" ? "Create account" : "Have account? Login"}
          </button>
        </div>
      </form>
    </div>
  );
}
