import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Toaster } from "react-hot-toast";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ExamProvider } from "./context/ExamContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ExamProvider>
          <App />
          <Toaster position="top-right" />
        </ExamProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
