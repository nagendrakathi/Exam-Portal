import React, { createContext, useContext, useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";

const ExamContext = createContext();

export function ExamProvider({ children }) {
  const [session, setSession] = useState(null);

  const startExam = async () => {
    try {
      const res = await api.post("/api/exam/start");
      setSession(res.data);
      toast.success("Exam started");
      return res.data;
    } catch (err) {
      toast.error(err?.response?.data?.message || "Start failed");
    }
  };

  const updateAnswer = async (sessionId, index, selectedIndex) => {
    try {
      await api.patch(`/api/exam/${sessionId}/answer`, {
        index,
        selectedIndex,
      });
      setSession((prev) => {
        if (!prev) return prev;
        const updated = { ...prev };
        updated.questions[index].selectedIndex = selectedIndex;
        return updated;
      });
    } catch {
      toast.error("Failed to save answer");
    }
  };

  const submitExam = async (sessionId) => {
    try {
      const res = await api.post(`/api/exam/${sessionId}/submit`);
      toast.success(`Submitted. Score ${res.data.score}/${res.data.total}`);
      setSession(null);
      return res.data;
    } catch (err) {
      toast.error(err?.response?.data?.message || "Submit failed");
    }
  };

  return (
    <ExamContext.Provider
      value={{ session, setSession, startExam, updateAnswer, submitExam }}
    >
      {children}
    </ExamContext.Provider>
  );
}
//eslint-disable-next-line react-refresh/only-export-components
export const useExam = () => useContext(ExamContext);