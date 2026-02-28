#!/usr/bin/env node
import { Command } from "commander";
import { parseTextQuestions } from "../src/parsers/text.js";
import { parseExcelQuestions } from "../src/parsers/excel.js";
import { processQuestions } from "../src/ai/checker.js";
import { exportToText } from "../src/formatters/text.js";
import "dotenv/config";

const program = new Command();

program
  .name("sessiya")
  .description("CLI tool for managing and AI-calculating session questions")
  .version("1.0.0");

// PARSE COMMAND
program
  .command("parse")
  .description("Parse questions from a plain text file")
  .argument("<input>", "Input text file (input.txt)")
  .option("-o, --output <output>", "Output JSON file path", "questions.json")
  .action((input, options) => {
    parseTextQuestions(input, options.output);
  });

// EXCEL COMMAND
program
  .command("excel")
  .description("Parse questions from an Excel (.xlsx) file")
  .argument("<input>", "Input Excel file (test.xlsx)")
  .option("-o, --output <output>", "Output JSON file path", "questions.json")
  .option("-s, --start <number>", "Start question number", "1")
  .action((input, options) => {
    parseExcelQuestions(input, options.output, parseInt(options.start));
  });

// AI CHECK COMMAND
program
  .command("check")
  .description("Generate answers for questions using Gemini AI")
  .argument("<input>", "Input JSON questions file")
  .option("-o, --output <output>", "Output answers text file", "ai-answers.txt")
  .option("-k, --key <key>", "Gemini API Key (instead of .env)")
  .action(async (input, options) => {
    const apiKey = options.key || process.env.GOOGLE_GENAI_API_KEY;
    if (!apiKey) {
      console.error("❌ Missing Gemini API Key. Provide it via .env or --key.");
      process.exit(1);
    }
    await processQuestions(input, options.output, apiKey);
  });

// EXPORT COMMAND
program
  .command("export")
  .description("Export JSON questions to a readable text format")
  .argument("<input>", "Input JSON file")
  .argument("<output>", "Output text file")
  .action((input, output) => {
    exportToText(input, output);
  });

program.parse(process.argv);
