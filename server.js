require("dotenv").config();
const express  = require("express");
const path     = require("path");
const multer   = require("multer");
const pdfParse = require("pdf-parse");
const Groq     = require("groq-sdk");
const { exec } = require("child_process");

const app  = express();
const PORT = 3000;

// ── Groq client ──
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ── Multer: store uploaded PDF in memory ──
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter(req, file, cb) {
    file.mimetype === "application/pdf"
      ? cb(null, true)
      : cb(new Error("Only PDF files are accepted."));
  },
});

// ── Middleware ──
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// ────────────────────────────────────────────────────────────
//  KEYWORD MATCHING HELPERS  (local, fast — no AI needed)
// ────────────────────────────────────────────────────────────
const STOP_WORDS = new Set([
  "a","an","the","and","or","but","in","on","at","to","for","of","with",
  "by","from","is","are","was","were","be","been","has","have","had",
  "will","would","could","should","may","might","do","does","did","not",
  "this","that","these","those","we","you","they","it","its","our","your",
  "their","as","if","so","about","into","than","then","also","more","such",
  "can","all","any","each","both","other","which","who","what","how","when",
  "up","out","no","new","get","use","using","used","work","working","ability",
  "experience","years","year","strong","good","team","role","position",
  "candidate","looking","required","requirements","preferred","plus","well",
]);

function tokenise(text) {
  return new Set(
    text.toLowerCase()
      .replace(/[^a-z0-9#+.\-/]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 2 && !STOP_WORDS.has(w))
  );
}

function extractPhrases(text) {
  const lower = text.toLowerCase();
  const techPatterns = [
    /node\.js/g,/react\.js/g,/vue\.js/g,/next\.js/g,/express\.js/g,
    /angular\.js/g,/typescript/g,/javascript/g,/python/g,/java\b/g,
    /c\+\+/g,/c#/g,/ruby\b/g,/golang/g,/rust\b/g,/swift\b/g,
    /kotlin/g,/php\b/g,/scala\b/g,
    /postgresql/g,/mongodb/g,/mysql/g,/redis/g,/sqlite/g,
    /elasticsearch/g,/dynamodb/g,
    /docker/g,/kubernetes/g,/terraform/g,/ansible/g,
    /aws\b/g,/azure\b/g,/gcp\b/g,
    /ci\/cd/g,/github actions/g,/jenkins/g,/gitlab/g,
    /graphql/g,/rest api/g,/restful/g,/grpc/g,
    /machine learning/g,/deep learning/g,/natural language/g,
    /data science/g,/data analysis/g,
    /agile/g,/scrum/g,/kanban/g,
    /linux/g,/unix/g,/bash/g,/shell/g,
    /figma/g,/jira/g,/confluence/g,/git\b/g,
  ];
  const found = new Set();
  for (const p of techPatterns) {
    const m = lower.match(p);
    if (m) m.forEach((v) => found.add(v));
  }
  return found;
}

function analyseMatch(resumeText, jobText) {
  const resumeTokens = tokenise(resumeText);
  const jobTokens    = tokenise(jobText);
  const jobPhrases   = extractPhrases(jobText);
  const resumeLower  = resumeText.toLowerCase();

  const phrasesMatched = [], phrasesMissing = [];
  for (const phrase of jobPhrases) {
    (resumeLower.includes(phrase) ? phrasesMatched : phrasesMissing).push(phrase);
  }

  const tokenMatched = [], tokenMissing = [];
  for (const token of jobTokens) {
    if (token.length < 3) continue;
    (resumeTokens.has(token) ? tokenMatched : tokenMissing).push(token);
  }

  const matched = [...new Set([...phrasesMatched, ...tokenMatched])].sort();
  const missing = [...new Set([...phrasesMissing, ...tokenMissing])]
    .filter((k) => !matched.includes(k)).sort();

  const total = matched.length + missing.length;
  const score = total === 0 ? 0 : Math.round((matched.length / total) * 100);
  return { matched, missing, score };
}

// ────────────────────────────────────────────────────────────
//  GROQ AI FEEDBACK
// ────────────────────────────────────────────────────────────
async function getGroqFeedback(resumeText, jobDescription, keywordScore) {
  // Trim resume to 3000 chars so we stay well within token limits
  const resumeSnippet = resumeText.length > 3000
    ? resumeText.slice(0, 3000) + "\n[... truncated for brevity ...]"
    : resumeText;

  const prompt = `
You are an expert technical recruiter and resume coach.

A candidate has uploaded their resume and is applying for a job. Your task is to give honest, specific, and actionable feedback.

---
RESUME TEXT:
${resumeSnippet}

---
JOB DESCRIPTION:
${jobDescription}

---
KEYWORD MATCH SCORE (already calculated): ${keywordScore}%

---
Please respond in the following JSON format ONLY — no markdown, no extra text:

{
  "overallFeedback": "2-3 sentence honest summary of how well this resume fits the job",
  "strengths": [
    "Specific strength 1",
    "Specific strength 2",
    "Specific strength 3"
  ],
  "weaknesses": [
    "Specific weakness or gap 1",
    "Specific weakness or gap 2",
    "Specific weakness or gap 3"
  ],
  "improvements": [
    "Actionable improvement suggestion 1",
    "Actionable improvement suggestion 2",
    "Actionable improvement suggestion 3"
  ],
  "rewrittenBullet": {
    "original": "Copy one weak or vague bullet point verbatim from the resume",
    "rewritten": "A stronger, more impactful rewrite of that bullet using action verbs and quantified impact"
  }
}
`.trim();

  const completion = await groq.chat.completions.create({
    model: "openai/gpt-oss-120b",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.4,
    max_tokens: 1500,
    response_format: { type: "json_object" },
  });

  const raw = completion.choices[0]?.message?.content || "";

  // Parse JSON — strip any accidental markdown fences
  const cleaned = raw.replace(/```json|```/g, "").trim();
  return JSON.parse(cleaned);
}

// ────────────────────────────────────────────────────────────
//  POST /api/review
// ────────────────────────────────────────────────────────────
app.post("/api/review", upload.single("resume"), async (req, res) => {
  try {
    const { jobDescription } = req.body;

    if (!req.file)                              return res.status(400).json({ error: "No resume file uploaded." });
    if (!jobDescription?.trim())                return res.status(400).json({ error: "Job description is required." });
    if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === "your_groq_api_key_here") {
      return res.status(500).json({ error: "GROQ_API_KEY is not set. Add it to your .env file." });
    }

    // ── Step 1: Extract PDF text ──
    let resumeText = "", pageCount = 0;
    try {
      const parsed = await pdfParse(req.file.buffer);
      resumeText = parsed.text || "";
      pageCount  = parsed.numpages || 0;
    } catch {
      return res.status(422).json({ error: "Could not read the PDF. Make sure it contains selectable text." });
    }

    const cleanedText = resumeText.trim();
    if (cleanedText.length < 50) {
      return res.status(422).json({ error: "The PDF appears to be a scanned image or contains very little text." });
    }

    // ── Step 2: Extraction metadata ──
    const wordCount = cleanedText.split(/\s+/).length;
    const charCount = cleanedText.length;
    const PREVIEW_LIMIT = 600;
    let preview = cleanedText.slice(0, PREVIEW_LIMIT);
    if (cleanedText.length > PREVIEW_LIMIT) {
      preview = preview.slice(0, preview.lastIndexOf(" ")) + "…";
    }

    // ── Step 3: Local keyword matching ──
    const { matched, missing, score } = analyseMatch(cleanedText, jobDescription);

    // ── Step 4: Groq AI feedback ──
    let aiFeedback = null;
    try {
      aiFeedback = await getGroqFeedback(cleanedText, jobDescription, score);
    } catch (aiErr) {
      console.error("Groq AI error:", aiErr.message);
      // Don't fail the whole request — return partial results with an AI error note
      aiFeedback = { error: "AI feedback unavailable: " + aiErr.message };
    }

    return res.status(200).json({
      extraction: { pageCount, wordCount, charCount, preview, fullText: cleanedText },
      score,
      matched,
      missing,
      jobWordCount: jobDescription.trim().split(/\s+/).length,
      aiFeedback,
    });

  } catch (err) {
    console.error("Error in /api/review:", err.message);
    return res.status(500).json({ error: "Internal server error." });
  }
});

// ── Multer error handler ──
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      error: err.code === "LIMIT_FILE_SIZE"
        ? "File is too large. Maximum size is 5 MB."
        : err.message,
    });
  }
  if (err) return res.status(400).json({ error: err.message });
  next();
});

app.listen(PORT, () => {
  const url = `http://localhost:${PORT}`;
  console.log(`Resume Reviewer running at ${url}`);

  // Automatically open the browser
  const openCmd =
    process.platform === "win32"  ? `start "" "${url}"` :
    process.platform === "darwin" ? `open "${url}"` :
                                    `xdg-open "${url}"`;

  exec(openCmd, (err) => {
    if (err) console.error("Could not open browser:", err.message);
  });
});
