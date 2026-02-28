import fs from "fs";

/**
 * Parses questions from a plain text file.
 * Expects:
 *   Question text...
 *   Option A (potentially starting with # for correct)
 *   Option B
 *   Option C
 *   Option D
 */
export function parseTextQuestions(inputFilePath, outputFilePath) {
  try {
    const data = fs.readFileSync(inputFilePath, "utf8");
    const cleaned = data
      .split("\n")
      .map(line => line.trim())
      .filter(line => line !== "");

    const finalJson = [];
    const answerListOptions = ["A", "B", "C", "D"];

    // Logic: every 5 lines = 1 question
    for (let i = 0; i < cleaned.length; i += 5) {
      const questionText = cleaned[i];
      const rawAnswers = [
        cleaned[i + 1],
        cleaned[i + 2],
        cleaned[i + 3],
        cleaned[i + 4],
      ];

      let correctIndex = -1;
      const mappedOptions = rawAnswers.map((line, index) => {
        if (line.startsWith("#")) {
          correctIndex = index;
          return line.substring(1).trim();
        }
        return line.trim();
      });

      finalJson.push({
        questionNumber: i / 5 + 1,
        question: questionText,
        options: {
          A: mappedOptions[0],
          B: mappedOptions[1],
          C: mappedOptions[2],
          D: mappedOptions[3],
        },
        correctAnswer:
          correctIndex !== -1 ? answerListOptions[correctIndex] : "A", // defaults back to A if not marked
      });
    }

    fs.writeFileSync(
      outputFilePath,
      JSON.stringify(finalJson, null, 2),
      "utf8"
    );
    console.log(
      `✅ ${finalJson.length} questions parsed and saved to ${outputFilePath}`
    );
    return finalJson;
  } catch (err) {
    console.error("❌ Parsing failed:", err.message);
    throw err;
  }
}
