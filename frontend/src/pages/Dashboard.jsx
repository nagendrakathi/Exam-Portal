import React, { useEffect, useState } from "react";
import { useExam } from "../context/ExamContext";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";

export default function Dashboard() {
  const { startExam } = useExam();
  const [sessions, setSessions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res = await axiosInstance.get("/api/exam/mine"); // optional
        setSessions(res.data || []); // API already returns array
      } catch {
        setSessions([]);
      }
    })();
  }, []);

  const start = async () => {
    const s = await startExam();
    if (s?.sessionId) navigate(`/exam/${s.sessionId}`);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Dashboard</h2>
        <button
          onClick={start}
          className="px-5 py-2 bg-teal-600 text-white rounded"
        >
          Start Exam
        </button>
      </div>

      <section className="bg-white rounded shadow p-4">
        <h3 className="font-semibold mb-3">Past Sessions</h3>
        {sessions.length === 0 ? (
          <div className="text-sm text-slate-500">No past sessions yet.</div>
        ) : (
          <ul className="space-y-2">
            {sessions.map((s) => (
              <li
                key={s.sessionId}
                className="border rounded p-3 flex justify-between"
              >
                <div>
                  <div className="font-medium">Session {s.sessionId}</div>
                  <div className="text-xs text-slate-500">
                    {s.submittedAt
                      ? `Submitted: ${new Date(s.submittedAt).toLocaleString()}`
                      : `Started: ${new Date(s.startedAt).toLocaleString()}`}
                  </div>
                  <div className="text-xs text-slate-500">
                    Score: {s.score} / {s.total}
                  </div>
                </div>
                {/* <button
                  onClick={() => navigate(`/exam/${s.sessionId}`)}
                  className="px-3 py-1 border rounded text-sm"
                >
                  View
                </button> */}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
