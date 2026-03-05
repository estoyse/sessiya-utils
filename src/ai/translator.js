import { GoogleGenAI } from "@google/genai";
import fs from "fs";
import "dotenv/config";

// CONFIG
const BATCH_SIZE = 10;
const MAGIC_VAR = 5000; // 5 seconds wait per batch

async function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function safeGenerate(client, prompt, retries = 5) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const result = await client.models.generateContent({
        model: "gemini-2.5-flash",
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
  const prompt = `
You will receive multiple choice questions uzbek. you should translate them into english while preserving the structure. answer only final output file. no code no markdown elements just plain text in the format like:

"1. Mumtoz yoki ma'muriy menejment namoyondalarini aniqlang?
A)Fayol, M. Veber va boshq.
B)Teylor, G. Emerson va boshq.
C)Amir Temur va boshq.
D)Teylor va boshq.
To'g'ri javob: A"

Do NOT output JSON.
Do NOT include explanations.
Do NOT repeat the questions.
Answer with preserving input format

Here are the questions:
${batch.join("\n")}
  `;

  return await safeGenerate(client, prompt);
}

export async function translate(inputPath, outputPath, apiKey) {
  if (!apiKey) {
    throw new Error("Missing Gemini API Key");
  }

  const client = new GoogleGenAI({ apiKey });
  const data = fs.readFileSync(inputPath, "utf8");
  const cleaned = data
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line !== "");

  const questionArray = [];

  for (let i = 0; i < cleaned.length; i += 6) {
    let combined = `${cleaned[i]}\n${cleaned[i + 1]}\n${cleaned[i + 2]}\n${cleaned[i + 3]}\n${cleaned[i + 4]}\n${cleaned[i + 5]}`;
    questionArray.push(combined);
  }

  let results = "";
  const batches = [];
  for (let i = 0; i < questionArray.length; i += BATCH_SIZE) {
    batches.push(questionArray.slice(i, i + BATCH_SIZE));
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
