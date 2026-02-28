import fs from "fs";

/**
 * Converts JSON back to formatted plain text for easier reading.
 */
export function exportToText(inputJsonPath, outputTextPath) {
  try {
    const questions = JSON.parse(fs.readFileSync(inputJsonPath, "utf8"));

    const formatted = questions.map(q => {
      return `${q.questionNumber}. ${q.question}\nA)${q.options.A}\nB)${q.options.B}\nC)${q.options.C}\nD)${q.options.D}\nTo'g'ri javob: ${q.correctAnswer}`;
    });

    fs.writeFileSync(outputTextPath, formatted.join("\n\n"), "utf8");
    console.log(`✅ Formatted questions exported to ${outputTextPath}`);
  } catch (err) {
    console.error("❌ Text export failed:", err.message);
    throw err;
  }
}
