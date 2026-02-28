# 🦉 Sessiya Advanced Usage Guide

Welcome to the **Sessiya** mastery manual. This guide will walk you through the specifics of each command and its available options to help you build the perfect question set.

---

## 1. 🏗 Parsing Text Questions

If you have a collection of questions in a plain text format, use the `parse` command.

### Formatting Input

The parser expects blocks of 5 lines:

- **Line 1**: The Question text.
- **Lines 2-5**: Four options (A, B, C, D).

To mark the correct answer manually:

```text
The capital of Uzbekistan?
#Tashkent
Samarkand
Bukhara
Khiva
```

_Wait... the parser will recognize `#Tashkent` and set `correctAnswer: "A"`._

### Command

```bash
./bin/sessiya.js parse ./files/input.txt --output questions.json
```

---

## 2. 📊 Parsing Excel Spreadsheets

If your data is in an Excel sheet (`.xlsx`), use the `excel` command.

### Spreadsheet Structure

- **Column A**: Question text.
- **Column B**: Option A.
- **Column C**: Option B.
- **Column D**: Option C.
- **Column E**: Option D.
- **Column F**: (Optional) Correct answer letter (e.g., "A", "B", "C", "D").

### Command

```bash
./bin/sessiya.js excel ./files/questions.xlsx --output questions.json --start 1
```

_The `--start` flag lets you specify the initial question number (useful for splitting large sets)._

---

## 3. 🧠 Solving with Gemini AI

One of **Sessiya's** most powerful features is the `check` command. It uses Google's Gemini models to find answers for you.

### Batch Processing

The tool processes questions in **batches of 10** with a **5-second cooldown** to avoid rate limits. This ensures a stable and reliable experience even for hundreds of questions.

### Custom API Key

Instead of using the `.env` file, you can pass a key directly:

```bash
./bin/sessiya.js check questions.json --key "YOUR_API_KEY"
```

### Output Format

The `check` command generates a simple text report (like `ai-answers.txt`):

```text
1. A
2. C
3. B
...
```

---

## 📤 4. Exporting to Readable Text

Need to print your questions? Use the `export` command to turn JSON back into a clean, human-readable format.

```bash
./bin/sessiya.js export questions.json formatted_questions.txt
```

---

## Summary of Options

| Command | Option            | Description                                            |
| :------ | :---------------- | :----------------------------------------------------- |
| `parse` | `--output` / `-o` | Specify output file path (default: `questions.json`).  |
| `excel` | `--output` / `-o` | Specify output file path.                              |
| `excel` | `--start` / `-s`  | Initial question number (default: `1`).                |
| `check` | `--output` / `-o` | Specify answers file path (default: `ai-answers.txt`). |
| `check` | `--key` / `-k`    | Pass a custom Google API key.                          |

---

## Troubleshooting

- **`Missing Gemini API Key`**: Ensure `.env` is correctly formatted or use the `--key` flag.
- **`Parsing failed`**: Double-check that your `input.txt` follows the 5-line-per-question pattern.
- **`Excel Error`**: Ensure your file is saved as `.xlsx` (not `.xls` or `.csv`).

---

_Made with 🦉 for the Sessiya project._
