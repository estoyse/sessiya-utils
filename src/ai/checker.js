import { GoogleGenAI } from "@google/genai";
import fs from "fs";
import "dotenv/config";

// CONFIG
const BATCH_SIZE = 10;
const MAGIC_VAR = 5000; // 5 seconds wait per batch

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function safeGenerate(client, prompt, retries = 5) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const result = await client.models.generateContent({
        model: "gemma-3-12b",
        contents: prompt,
        config: {
          thinkingConfig: { thinkingBudget: 0 },
        },
      });
      return result.text;
    } catch (err) {
      console.error(`Attempt ${attempt} failed:`, err.message);
      if (attempt === retries) throw err;

      const delayMs = 1000 * Math.pow(2, attempt);
      console.log(`Retrying in ${delayMs / 1000}s...`);
      await delay(delayMs);
    }
  }
}

async function checkBatch(client, batch) {
  const formatted = batch.map(q => ({
    number: q.questionNumber,
    question: q.question,
    options: q.options,
  }));

  const prompt = `
You will receive multiple choice questions.
Return the answer ONLY in this exact text format:
<number>. <CorrectOptionLetter>

Example:
1. B
2. A

Do NOT output JSON.
Do NOT include explanations.
Do NOT repeat the questions.

Here are the questions:
${JSON.stringify(formatted, null, 2)}
  `;

  return await safeGenerate(client, prompt);
}

export async function processQuestions(inputPath, outputPath, apiKey) {
  if (!apiKey) {
    throw new Error("Missing Gemini API Key");
  }

  const client = new GoogleGenAI({ apiKey });
  const questions = JSON.parse(fs.readFileSync(inputPath, "utf8"));

  let results = "";
  const batches = [];
  for (let i = 0; i < questions.length; i += BATCH_SIZE) {
    batches.push(questions.slice(i, i + BATCH_SIZE));
  }

  for (let i = 0; i < batches.length; i++) {
    console.log(`⏳ Processing batch ${i + 1}/${batches.length}...`);
    try {
      const response = await checkBatch(client, batches[i]);
      results += response + "\n";
    } catch (err) {
      console.error(`❌ Error in batch ${i + 1}:`, err.message);
    }

    if (i < batches.length - 1) {
      console.log(`⏲️ Cooling down for ${MAGIC_VAR / 1000}s...`);
      await delay(MAGIC_VAR);
    }
  }

  fs.writeFileSync(outputPath, results.trim() + "\n", "utf8");
  console.log(`✅ Success! Answers saved to: ${outputPath}`);
}
