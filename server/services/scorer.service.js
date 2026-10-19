// Weights for each test in final score
export const TEST_WEIGHTS = {
    mcq_technical: 0.30,   // 30%
    written:       0.25,   // 25%
    aptitude:      0.20,   // 20%
    soft_skills:   0.15,   // 15%
    project:       0.10,   // 10%
};

export const TEST_NAMES = {
    mcq_technical: "Technical Knowledge",
    written:       "Knowledge Depth",
    aptitude:      "Aptitude & Reasoning",
    soft_skills:   "Soft Skills",
    project:       "Project Deep Dive",
};

/**
 * Score a list of MCQ answers.
 * Each submission: {question_id, selected_answer, correct_answer, explanation}
 * Returns per-question results + total correct + score out of 10.
 */
export function scoreMcqBatch(submissions) {
    const results = [];
    let correctCount = 0;

    for (const sub of submissions) {
        const isCorrect = sub.selected_answer === sub.correct_answer;
        if (isCorrect) {
            correctCount++;
        }

        results.push({
            question_id:      sub.question_id,
            selected_answer:  sub.selected_answer,
            correct_answer:   sub.correct_answer,
            is_correct:       isCorrect,
            explanation:      sub.explanation || ""
        });
    }

    const total = submissions.length;
    const percentage = total > 0 ? (correctCount / total * 100) : 0;
    const scoreOutOf10 = total > 0 ? ((correctCount / total) * 10) : 0;

    return {
        results,
        correct:          correctCount,
        total,
        percentage:       parseFloat(percentage.toFixed(1)),
        score_out_of_10:  parseFloat(scoreOutOf10.toFixed(1))
    };
}

/**
 * Calculate score for one complete test after all questions answered.
 * For MCQ tests: counts correct answers.
 * For AI-evaluated tests: averages the AI scores.
 */
export function calculateTestScore(testType, answers, totalQuestions) {
    if (!answers || answers.length === 0) {
        return {
            test_type:        testType,
            test_name:        TEST_NAMES[testType] || testType,
            score:            0,
            total:            totalQuestions,
            percentage:       0,
            score_out_of_10:  0
        };
    }

    let score = 0;
    let percentage = 0;
    let correct = null;

    if (testType === "mcq_technical" || testType === "aptitude") {
        // answers = list of booleans (true/false per question)
        const correctCount = answers.filter(a => a === true).length;
        percentage = (correctCount / totalQuestions) * 100;
        score = (correctCount / totalQuestions) * 10;
        correct = correctCount;
    } else {
        // answers = list of AI scores (integers 1-10)
        const sum = answers.reduce((a, b) => a + b, 0);
        const avg = sum / answers.length;
        percentage = avg * 10;
        score = avg;
    }

    return {
        test_type:        testType,
        test_name:        TEST_NAMES[testType] || testType,
        score:            parseFloat(score.toFixed(1)),
        total:            10,
        percentage:       parseFloat(percentage.toFixed(1)),
        score_out_of_10:  parseFloat(score.toFixed(1)),
        correct
    };
}

/**
 * Calculate weighted overall score across all completed tests.
 * If Test 5 (project) was skipped, redistribute its weight equally.
 */
export function calculateOverallScore(testScores) {
    const completedTypes = new Set(testScores.map(ts => ts.test_type));

    // Recalculate weights if project test was skipped
    const activeWeights = {};
    for (const [type, weight] of Object.entries(TEST_WEIGHTS)) {
        if (completedTypes.has(type)) {
            activeWeights[type] = weight;
        }
    }

    // Normalize so weights still add to 1.0
    const totalWeight = Object.values(activeWeights).reduce((a, b) => a + b, 0);
    const normalized = {};
    for (const [type, weight] of Object.entries(activeWeights)) {
        normalized[type] = weight / totalWeight;
    }

    // Calculate weighted score
    let weightedSum = 0;
    for (const ts of testScores) {
        const type = ts.test_type;
        const weight = normalized[type] || 0;
        weightedSum += ts.score_out_of_10 * weight;
    }

    const overall = parseFloat(weightedSum.toFixed(1));
    const percentage = parseFloat((overall * 10).toFixed(1));

    // Determine rating
    let rating = "Needs Work";
    if (overall >= 8.5) {
        rating = "Elite";
    } else if (overall >= 7.0) {
        rating = "Strong";
    } else if (overall >= 5.5) {
        rating = "Developing";
    }

    // Readiness score (0-100)
    const readiness = Math.min(100, Math.round(percentage));

    return {
        overall_score:      overall,
        overall_percentage: percentage,
        rating,
        readiness_score:    readiness,
        test_breakdown:     testScores,
        weights_used:       normalized
    };
}

/**
 * Returns emoji label for any score out of 10.
 */
export function getPerformanceLabel(score) {
    if (score >= 9) {
        return "🏆 Outstanding";
    } else if (score >= 7.5) {
        return "⭐ Excellent";
    } else if (score >= 6) {
        return "✅ Good";
    } else if (score >= 4) {
        return "⚠️ Average";
    } else {
        return "❌ Needs Work";
    }
}
