import mongoose from "mongoose";

const sessionQuestionSchema = new mongoose.Schema(
  {
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },
    prompt: {
      type: String,
      required: true,
    },
    options: {
      type: [String],
      required: true,
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length === 4,
        message: "Options must contain exactly 4 items",
      },
    },
    correctIndex: {
      type: Number,
      required: true,
      enum: [0, 1, 2, 3],
    },
    selectedIndex: {
      type: Number,
      default: null,
      validate: {
        validator: (v) =>
          v === null || (Number.isInteger(v) && v >= 0 && v <= 3),
        message: "Selected index must be null or between 0–3",
      },
    },
  },
  { _id: false }
);

const sessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    questions: {
      type: [sessionQuestionSchema],
      required: true,
    },
    durationMinutes: {
      type: Number,
      required: true,
      default: 30,
    },
    startedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
    submittedAt: {
      type: Date,
      default: null,
    },
    score: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Session = mongoose.model("Session", sessionSchema);
export default Session;
