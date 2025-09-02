import React, { useEffect, useState } from "react";
import { useExam } from "../context/ExamContext";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";

export default function Dashboard() {
  const { startExam } = useExam();
  const [sessions, setSessions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await axiosInstance.get("/api/exam/my-sessions");
        setSessions(res.data || []);
      } catch {
        setSessions([]);
      }
    };
    fetchSessions();
  }, []);

  const start = async () => {
    const s = await startExam();
    if (s?.sessionId) navigate(`/exam/${s.sessionId}`);
  };

  return (
    <div className="max-w-8xl mx-auto px-8 py-6">
      <div className="flex items-center gap-10 mb-6">
        <h2 className="text-2xl font-semibold">Dashboard</h2>
        <button
          onClick={start}
          className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded cursor-pointer"
        >
          Start Exam
        </button>
      </div>

      <section className="p-4 w-full">
        <h3 className="font-semibold mb-4">Past Sessions</h3>

        {sessions.length === 0 ? (
          <div className="text-sm text-slate-500">No past sessions yet.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {sessions.map((s, idx) => (
              <div
                key={s.sessionId}
                className="border border-transparent shadow-md rounded-xl p-5 flex flex-col justify-between hover:shadow-md transition cursor-pointer"
              >
                <div>
                  <div className="font-medium mb-1">
                    Session {sessions.length - idx}
                  </div>
                  <div className="text-xs text-slate-500 mb-2">
                    {s.submittedAt
                      ? `Submitted: ${new Date(s.submittedAt).toLocaleString()}`
                      : `Started: ${new Date(
                          s.startedAt
                        ).toLocaleString()} (Click Continue to resume)`}
                  </div>
                  <div className="text-xs text-slate-500">
                    Score: {s.score ?? 0} / {s.total ?? 0}
                  </div>
                </div>
                <button
                  onClick={async () => {
                    if (s.submittedAt) {
                      navigate(`/exam/${s.sessionId}/result`);
                    } else {
                      try {
                        const resumed = await startExam(s.sessionId);
                        if (resumed?.sessionId) {
                          navigate(`/exam/${resumed.sessionId}`);
                        } else {
                          alert("Failed to resume exam. Please try again.");
                        }
                      } catch (err) {
                        console.error(err);
                        alert("Something went wrong. Please try again.");
                      }
                    }
                  }}
                  className="text-white font-medium mt-4 px-3 py-1 border-2 border-transparent rounded-md text-sm w-full text-center bg-blue-600/80  hover:bg-blue-400 transition cursor-pointer"
                >
                  {s.submittedAt ? "View Result" : "Continue Exam"}
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
