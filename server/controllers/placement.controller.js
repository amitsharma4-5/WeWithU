import PlacementTest from "../models/placement.model.js";
import User from "../models/user.model.js";

export const startPlacementTest = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.credits < 50) {
      return res.status(400).json({ message: "Insufficient credits. Minimum 50 credits required to start this Placement Mock Exam drive." });
    }

    const { candidateName, targetRole, level, difficultyMode } = req.body;

    if (!candidateName || !targetRole || !level) {
      return res.status(400).json({ message: "Missing required details to start exam." });
    }

    const newTest = await PlacementTest.create({
      userId: user._id,
      candidateName,
      targetRole,
      level,
      difficultyMode: difficultyMode || "medium",
      status: "Incompleted",
      testScores: []
    });

    user.credits -= 50;
    await user.save();

    return res.status(201).json({
      message: "Placement exam started, 50 credits deducted.",
      creditsLeft: user.credits,
      testId: newTest._id
    });
  } catch (error) {
    console.error("startPlacementTest error:", error);
    return res.status(500).json({ message: `Failed to start placement drive: ${error.message || error}` });
  }
};

export const savePlacementTest = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const {
      testId,
      candidateName,
      targetRole,
      level,
      difficultyMode,
      resumeText,
      resumeData,
      testScores,
      allStrengths,
      allWeaknesses,
      finalReport
    } = req.body;

    if (!candidateName || !targetRole || !level || !testScores || !finalReport) {
      return res.status(400).json({ message: "Missing required placement exam data." });
    }

    let test;
    if (testId) {
      test = await PlacementTest.findById(testId);
      if (test) {
        test.candidateName = candidateName;
        test.targetRole = targetRole;
        test.level = level;
        test.difficultyMode = difficultyMode || "medium";
        test.resumeText = resumeText;
        test.resumeData = resumeData;
        test.testScores = testScores;
        test.allStrengths = allStrengths;
        test.allWeaknesses = allWeaknesses;
        test.finalReport = finalReport;
        test.status = "completed";
        await test.save();
      }
    }

    if (!test) {
      // Fallback: if no testId was supplied or found, deduct credits and create new one
      if (user.credits < 50) {
        return res.status(400).json({ message: "Insufficient credits. Minimum 50 credits required to complete this Placement Mock Exam drive." });
      }
      test = await PlacementTest.create({
        userId: user._id,
        candidateName,
        targetRole,
        level,
        difficultyMode: difficultyMode || "medium",
        resumeText,
        resumeData,
        testScores,
        allStrengths,
        allWeaknesses,
        finalReport,
        status: "completed"
      });
      user.credits -= 50;
      await user.save();
    }

    return res.status(200).json({
      message: "Placement test saved successfully.",
      creditsLeft: user.credits,
      testId: test._id
    });
  } catch (error) {
    console.error("savePlacementTest error:", error);
    return res.status(500).json({ message: `Failed to save placement drive: ${error.message || error}` });
  }
};

export const getMyPlacementTests = async (req, res) => {
  try {
    const tests = await PlacementTest.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .select("targetRole level finalReport createdAt status");
    return res.json(tests);
  } catch (error) {
    console.error("getMyPlacementTests error:", error);
    return res.status(500).json({ message: `Failed to retrieve history: ${error.message || error}` });
  }
};

export const getPlacementTestReport = async (req, res) => {
  try {
    const test = await PlacementTest.findById(req.params.id);
    if (!test) {
      return res.status(404).json({ message: "Placement report not found." });
    }

    // Verify ownership
    if (test.userId.toString() !== req.userId) {
      return res.status(403).json({ message: "Unauthorized access to this report." });
    }

    return res.json(test);
  } catch (error) {
    console.error("getPlacementTestReport error:", error);
    return res.status(500).json({ message: `Failed to fetch report: ${error.message || error}` });
  }
};
