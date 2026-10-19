import mongoose from "mongoose";

const placementTestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  candidateName: { type: String, required: true },
  targetRole: { type: String, required: true },
  level: { type: String, required: true },
  difficultyMode: { type: String, default: "medium" },
  resumeText: { type: String },
  resumeData: {
    name: { type: String },
    skills: [{ type: String }],
    projects: [{
      name: { type: String },
      description: { type: String }
    }],
    experience_level: { type: String },
    education: { type: String },
    summary: { type: String }
  },
  testScores: [{
    test_name: { type: String },
    test_type: { type: String },
    score: { type: Number },
    total: { type: Number },
    percentage: { type: Number },
    score_out_of_10: { type: Number }
  }],
  allStrengths: [{ type: String }],
  allWeaknesses: [{ type: String }],
  finalReport: {
    overall_score: { type: Number },
    overall_percentage: { type: Number },
    rating: { type: String },
    summary: { type: String },
    positive_areas: [{ type: String }],
    negative_areas: [{ type: String }],
    study_plan: [{
      topic: { type: String },
      priority: { type: String },
      resource: { type: String }
    }],
    readiness_score: { type: Number },
    estimated_ready_in: { type: String }
  },
  status: {
    type: String,
    enum: ["Incompleted", "completed"],
    default: "completed"
  }
}, { timestamps: true });

const PlacementTest = mongoose.model("PlacementTest", placementTestSchema);
export default PlacementTest;
