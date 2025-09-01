import mongoose from "mongoose";
import Question from "../models/question.model.js";
import Session from "../models/session.model.js";
import asyncHandler from "../utils/asyncHandler.js";

//Picking random questions from the Questions databse
const pickRandomQuestions = async (count) => {
  const docs = await Question.aggregate([{ $sample: { size: count } }]);
  return docs;
};

//Shuffle the options of a question
const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export const startExam = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const QUESTION_COUNT = parseInt(process.env.QUESTION_COUNT) || 30;
  const DURATION_MIN = parseInt(process.env.DURATION_MIN) || 30;

  let session = await Session.findOne({ user: userId, submittedAt: null });

  if (!session) {
    const questions = await pickRandomQuestions(QUESTION_COUNT);
    const qSnapshots = questions.map((q) => {
      const originalOptions = q.options;
      const shuffledOptions = shuffle(originalOptions);
      const correctIndex = shuffledOptions.findIndex(
        (opt) => opt === originalOptions[q.correctIndex]
      );
      return {
        question: q._id,
        prompt: q.prompt,
        options: shuffledOptions,
        correctIndex,
      };
    });
    session = await Session.create({
      user: new mongoose.Types.ObjectId(userId),
      questions: qSnapshots.map((qs) => ({
        question: qs.question,
        prompt: qs.prompt,
        options: qs.options,
        correctIndex: qs.correctIndex,
        selectedIndex: null,
      })),
      durationMinutes: DURATION_MIN,
      startedAt: new Date(),
    });
  }

  //returning questions without answers
  const safeQuestions = session.questions.map((qs, idx) => ({
    index: idx,
    questionId: qs.question,
    prompt: qs.prompt,
    options: qs.options,
    selectedIndex: qs.selectedIndex,
  }));
  res.json({
    sessionId: session._id,
    questions: safeQuestions,
    durationMinutes: session.durationMinutes,
    startedAt: session.startedAt,
  });
});

export const updateAnswer = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;
  const { index, selectedIndex } = req.body;

  const session = await Session.findOne({
    _id: sessionId,
    user: req.user._id,
    submittedAt: null,
  });
  if (!session)
    return res.status(404).json({ message: "Active session not found" });

  if (
    typeof index !== "number" ||
    index < 0 ||
    index >= session.questions.length
  )
    return res.status(400).json({ message: "Invalid question index" });

  if (
    selectedIndex !== null &&
    (typeof selectedIndex !== "number" ||
      selectedIndex < 0 ||
      selectedIndex > 3)
  )
    return res.status(400).json({ message: "Invalid selected index" });

  session.questions[index].selectedIndex = selectedIndex;
  await session.save();

  res.json({ ok: true });
});

export const submitExam = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;

  const session = await Session.findOne({
    _id: sessionId,
    user: req.user._id,
    submittedAt: null,
  });
  if (!session)
    return res
      .status(404)
      .json({ message: "Active session not found or maybe already submitted" });

  let score = 0;
  session.questions.forEach((q) => {
    if (q.selectedIndex !== null && q.selectedIndex === q.correctIndex)
      score += 1;
  });

  session.score = score;
  session.submittedAt = new Date();
  await session.save();

  res.json({
    sessionId: session._id,
    total: session.questions.length,
    score: session.score,
    submittedAt: session.submittedAt,
  });
});

export const getResult = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;
  const session = await Session.findOne({
    _id: sessionId,
    user: req.user._id,
  });
  if (!session) return res.status(404).json({ message: "Session not found" });
  if (!session.submittedAt)
    return res.status(400).json({ message: "Exam not submitted yet" });
  res.json({
    sessionId: session._id,
    total: session.questions.length,
    score: session.score,
    startedAt: session.startedAt,
    submittedAt: session.submittedAt,
    questions: session.questions.map((q, idx) => ({
      index: idx,
      prompt: q.prompt,
      options: q.options,
      selectedIndex: q.selectedIndex,
      correctIndex: q.correctIndex,
      isCorrect: q.selectedIndex === q.correctIndex,
    })),
  });
});

export const getSessions = asyncHandler(async (req, res) => {
  const sessions = await Session.find({ user: req.user._id }).sort({
    startedAt: -1,
  });
  res.json(
    sessions.map((session) => ({
      sessionId: session._id,
      total: session.questions.length,
      score: session.score,
      startedAt: session.startedAt,
      submittedAt: session.submittedAt,
      durationMinutes: session.durationMinutes,
      isOngoing: !session.submittedAt,
    }))
  );
});
