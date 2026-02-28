import XLSX from "xlsx";
import fs from "fs";

/**
 * Reads Excel file (assuming first 5 columns are Question, A, B, C, D, and 6th is Correct Answer).
 */
export function parseExcelQuestions(
  inputFilePath,
  outputFilePath,
  startNumber = 1
) {
  try {
    const workbook = XLSX.readFile(inputFilePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    const result = rows.map((row, index) => {
      return {
        questionNumber: index + startNumber,
        question: row[0] || "",
        options: {
          A: row[1] || "",
          B: row[2] || "",
          C: row[3] || "",
          D: row[4] || "",
        },
        correctAnswer: row[5] || "A", // default to A if empty
      };
    });

    fs.writeFileSync(outputFilePath, JSON.stringify(result, null, 2), "utf8");
    console.log(`✅ Excel data parsed and saved to ${outputFilePath}`);
    return result;
  } catch (err) {
    console.error("❌ Excel parsing failed:", err.message);
    throw err;
  }
}
