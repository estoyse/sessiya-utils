# 🦉 Sessiya - AI Question Processor

**Sessiya** is a powerful CLI tool designed for students, teachers, and content creators to manage, process, and automatically solve multiple-choice questions using Google's Gemini AI.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-green.svg)

---

## 🚀 Features

- **Multi-Source Parsing**: Convert plain text or Excel files into structured JSON.
- **AI Brain**: Automatically generate answers for your questions using Google's **Gemma** models.
- **Cool CLI Interface**: Simple, intuitive commands for every step.
- **Clean Export**: Convert processed questions back into readable formats.

---

## 🛠 Installation

1. Clone the repository and navigate into it.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory and add your Google GenAI API key:
   ```env
   GOOGLE_GENAI_API_KEY=your_api_key_here
   ```

---

## ⚡ Quick Start

### 1. Parse Questions from Text

Place your questions in a text file (e.g., `input.txt`) and run:

```bash
./bin/sessiya.js parse input.txt -o questions.json
```

### 2. Solve with AI

Use Gemini to find the correct answers:

```bash
./bin/sessiya.js check questions.json -o answers.txt
```

### 3. Parse from Excel

Have questions in a spreadsheet? Easy:

```bash
./bin/sessiya.js excel questions.xlsx -o output.json
```

---

## 📁 Command Reference

| Command  | Description                                | Arguments          |
| :------- | :----------------------------------------- | :----------------- |
| `parse`  | Parses plain text questions into JSON.     | `<input>`          |
| `excel`  | Parses Excel (.xlsx) files into JSON.      | `<input>`          |
| `check`  | Runs AI generation for answers.            | `<input>`          |
| `export` | Formats JSON questions into readable text. | `<input> <output>` |

_Run `./bin/sessiya.js --help` for more details on each command._

---

## 📝 Text Input Format

For the `parse` command, use this structure:

```text
What is the capital of France?
Paris
London
Berlin
Rome
```

_Note: To mark a correct answer manually, prefix it with `#` (e.g., `#Paris`)._

---

## 🤝 Contributing

Feel free to open issues or pull requests. Let's make sessions easier for everyone!
