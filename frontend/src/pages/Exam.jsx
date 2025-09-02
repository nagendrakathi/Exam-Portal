import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useExam } from "../context/ExamContext";
import QuestionCard from "../components/QuestionCard";
import Timer from "../components/Timer"
import { Loader } from "lucide-react";

export default function Exam() {
  const { sessionId } = useParams();
  const { session, updateAnswer, submitExam } = useExam();
  const [current, setCurrent] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (
      session &&
      (session.sessionId === sessionId || session._id === sessionId)
    ) {
      return;
    }
  }, [sessionId, session]);

  const handleSubmit = async () => {
    if (isSubmitted) return;
    setIsSubmitted(true);
    try {
      const res = await submitExam(sessionId);
      const finalId = res?.sessionId || sessionId;
      navigate(`/exam/${finalId}/result`, {
        replace: true,
        state: { justSubmitted: true },
      });
    } catch {
      setIsSubmitted(false);
    }
  };

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (!isSubmitted) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isSubmitted]);

  if (!session)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );

  const { questions, durationMinutes, startedAt } = session;

  return (
    <div
      className="fullscreen-wrapper"
      onClick={(e) => {
        if (!e.currentTarget.contains(e.target) && !isSubmitted) {
          handleSubmit();
        }
      }}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="mb-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold">Exam</h2>
          </div>
          <div className="flex gap-4">
            <Timer
              startedAt={startedAt}
              durationMinutes={durationMinutes}
              onExpire={handleSubmit}
            />
            <button
              onClick={handleSubmit}
              disabled={isSubmitted}
              className={`text-xs sm:text-[0.9rem] sm:font-medium px-3 py-2 rounded font-medium ${
                isSubmitted
                  ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                  : "bg-red-600 text-white cursor-pointer"
              }`}
            >
              {isSubmitted ? "Submitted" : "Submit Now"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <QuestionCard
              q={questions[current]}
              index={current}
              onSelect={(i, si) =>
                !isSubmitted && updateAnswer(sessionId, i, si)
              }
            />
            <div className="bg-white px-6 py-4 shadow rounded-md flex justify-between mt-4 min-w-full">
              <button
                onClick={() => setCurrent((c) => Math.max(0, c - 1))}
                disabled={isSubmitted}
                className={`px-3 py-2 rounded-md  border-2 border-gray-500/40 cursor-pointer text-sm${
                  isSubmitted ? "cursor-not-allowed opacity-50" : ""
                }`}
              >
                Previous
              </button>
              <button
                onClick={() =>
                  setCurrent((c) => Math.min(questions.length - 1, c + 1))
                }
                disabled={isSubmitted}
                className={`px-3 py-2 border-2 border-gray-500/40 rounded-md cursor-pointer text-sm${
                  isSubmitted ? "cursor-not-allowed opacity-50" : ""
                }`}
              >
                Next
              </button>
            </div>
          </div>
          <aside className="space-y-3">
            <div className="bg-white p-3 rounded-md shadow w-full">
              <div className="font-medium mb-2 text-sm">Navigation</div>
              <div className="grid grid-cols-5 gap-2">
                {questions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => !isSubmitted && setCurrent(i)}
                    className={`p-3 rounded-md border-none ${
                      q.selectedIndex !== null
                        ? "bg-green-100 border-green-300 cursor-pointer"
                        : "bg-red-100 cursor-pointer"
                    } ${isSubmitted ? "opacity-50" : ""} ${
                      current === i ? "bg-white" : ""
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}