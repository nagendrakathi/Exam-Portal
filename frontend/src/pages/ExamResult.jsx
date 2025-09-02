import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";
import { useExam } from "../context/ExamContext";

export default function ExamResult() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { session, setSession } = useExam();
  const [data, setData] = useState(
    session && session.sessionId === sessionId ? session : null
  );
  const [loading, setLoading] = useState(!data);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const fetchResult = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await axiosInstance.get(`/api/exam/${sessionId}`);
        if (!active) return;
        setData(res.data || null);
        setSession?.(res.data || null);
      } catch (e) {
        if (!active) return;
        setError(e?.response?.data?.message || "Failed to load result");
      } finally {
        if (active) setLoading(false);
      }
    };

    if (!data) fetchResult();
    return () => {
      active = false;
    };
  }, [sessionId, setSession, data]);

  const correctCount = useMemo(() => {
    if (!data?.questions) return 0;
    return data.questions.reduce((acc, q) => acc + (q.isCorrect ? 1 : 0), 0);
  }, [data]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="animate-pulse text-slate-500">Loading result...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="mb-3 text-sm text-red-600">{error}</div>
        <button
          onClick={() => navigate(-1)}
          className="px-3 py-1 border rounded"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="text-sm text-slate-500">No data.</div>
      </div>
    );
  }

  const submitted = data.submittedAt
    ? new Date(data.submittedAt).toLocaleString()
    : null;
  const started = data.startedAt
    ? new Date(data.startedAt).toLocaleString()
    : null;

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Result</h2>
        <Link
          to="/"
          className="px-4 py-2 border-2 border-gray-500/50 rounded-md text-sm hover:bg-slate-50 cursor-pointer"
        >
          Back to Dashboard
        </Link>
      </div>

      <section className="bg-white rounded-md shadow-sm p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-sm text-slate-500">Session</div>
            <div className="font-medium">{data.sessionId}</div>
          </div>
          <div>
            <div className="text-sm text-slate-500">Score</div>
            <div className="font-medium">
              {data.score ?? correctCount} /{" "}
              {data.total ?? data.questions?.length ?? 0}
            </div>
          </div>
          <div>
            <div className="text-sm text-slate-500">Started</div>
            <div className="font-medium">{started || "-"}</div>
          </div>
          <div>
            <div className="text-sm text-slate-500">Submitted</div>
            <div className="font-medium">{submitted || "-"}</div>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-md shadow p-4">
        <h3 className="font-semibold mb-3">Q&A Breakdown</h3>
        <ul className="space-y-3">
          {data.questions?.map((q) => {
            const selected = q.selectedIndex;
            const correct = q.correctIndex;
            const isCorrect = q.isCorrect;
            return (
              <li
                key={q.index}
                className={`border rounded-md p-3 ${
                  isCorrect
                    ? "border-green-300 bg-green-50"
                    : "border-red-300 bg-red-50"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="text-sm text-slate-500">Q{q.index + 1}</div>
                    <div className="font-medium mb-2">{q.prompt}</div>
                    <div className="text-sm">
                      <span className="text-slate-600">Selected: </span>
                      <span
                        className={
                          isCorrect ? "text-green-700" : "text-red-700"
                        }
                      >
                        {selected !== null && selected !== undefined
                          ? q.options[selected]
                          : "Not Answered"}
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="text-slate-600">Correct: </span>
                      <span className="text-green-700">
                        {q.options[correct]}
                      </span>
                    </div>
                  </div>
                  <div
                    className={`text-xs font-semibold px-2 py-1 rounded-md h-fit ${
                      isCorrect
                        ? "bg-green-200 text-green-800"
                        : "bg-red-200 text-red-800"
                    }`}
                  >
                    {isCorrect ? "Correct" : "Incorrect"}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
