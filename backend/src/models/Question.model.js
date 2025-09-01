import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
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
  },
  { timestamps: true }
);

const Question = mongoose.model("Question", questionSchema);
export default Question;
