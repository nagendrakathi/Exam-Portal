import React from "react";

export default function Modal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose}></div>
      <div className="relative h-fit bg-white rounded-lg shadow-lg w-full max-w-sm p-6 z-10">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-sm text-slate-500 cursor-pointer"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
}
