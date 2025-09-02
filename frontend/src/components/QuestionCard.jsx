import React from "react";

export default function QuestionCard({ q, index, onSelect }) {
  return (
    <div className="bg-white p-6 rounded-md shadow-sm w-full">
      <div className="mb-3 text-sm font-medium">Q{index + 1}. {q.prompt}</div>
      <div className="grid grid-cols-1 gap-2">
        {q.options.map((opt, i) => {
          const selected = q.selectedIndex === i;
          return (
            <button key={i}
              onClick={() => onSelect(index, i)}
              className={`option-btn text-sm text-left p-3 rounded-md border-2 border-gray-500/50 cursor-pointer ${selected ? "bg-teal-50 border-teal-300" : "hover:bg-slate-50"}`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${selected ? "bg-teal-600 text-white border-teal-600" : "text-slate-600"}`}>
                  {String.fromCharCode(65 + i)}
                </div>
                <div>{opt}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
