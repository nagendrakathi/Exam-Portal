import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useExam } from "../context/ExamContext";
import QuestionCard from "../components/QuestionCard";
import Timer from "../components/Timer";
import {Loader} from 'lucide-react';

export default function Exam() {
  const { sessionId } = useParams();
  const { session, setSession, updateAnswer, submitExam } = useExam();
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (session && session._id === sessionId) return;
  }, [sessionId, session]);


  if (!session)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );

  const { questions, durationMinutes, startedAt } = session;

  return (
    <div className="fullscreen-wrapper bg-slate-100">
      <Timer
        startedAt={startedAt}
        durationMinutes={durationMinutes}
        onExpire={() =>
          submitExam(sessionId).then(() => navigate("/dashboard"))
        }
      />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold">Exam</h2>
            <p className="text-sm text-slate-500">Session: {sessionId}</p>
          </div>
          <button
            onClick={() =>
              submitExam(sessionId).then(() => navigate("/dashboard"))
            }
            className="px-3 py-2 bg-red-600 text-white rounded"
          >
            Submit Now
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <QuestionCard
              q={questions[current]}
              index={current}
              onSelect={(i, si) => updateAnswer(sessionId, i, si)}
            />
          </div>

          <aside className="space-y-3">
            <div className="bg-white p-3 rounded shadow">
              <div className="font-medium mb-2">Navigation</div>
              <div className="grid grid-cols-5 gap-2">
                {questions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={`p-2 rounded border ${
                      q.selectedIndex !== null
                        ? "bg-teal-50 border-teal-300"
                        : "bg-white"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white p-3 rounded shadow">
              <div className="font-medium mb-2">Actions</div>
              <button
                onClick={() => setCurrent((c) => Math.max(0, c - 1))}
                className="px-3 py-2 border rounded mr-2"
              >
                Previous
              </button>
              <button
                onClick={() =>
                  setCurrent((c) => Math.min(questions.length - 1, c + 1))
                }
                className="px-3 py-2 border rounded"
              >
                Next
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
