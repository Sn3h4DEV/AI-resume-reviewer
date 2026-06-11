const express = require("express");
const path = require("path");
const multer = require("multer");

const app = express();
const PORT = 3000;

// ── Multer: store uploaded file in memory (no disk writes needed yet) ──
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
  fileFilter(req, file, cb) {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are accepted."));
    }
  },
});

// ── Middleware ──
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// ── POST /api/review ──
app.post("/api/review", upload.single("resume"), (req, res) => {
  try {
    const { jobDescription } = req.body;

    // Validate inputs
    if (!req.file) {
      return res.status(400).json({ error: "No resume file uploaded." });
    }
    if (!jobDescription || jobDescription.trim() === "") {
      return res.status(400).json({ error: "Job description is required." });
    }

    // ── Placeholder analysis ──
    // Replace the block below once an AI model (e.g. OpenAI) is integrated.
    const fileSizeKB = (req.file.size / 1024).toFixed(1);
    const wordCount = jobDescription.trim().split(/\s+/).length;

    const result = {
      message: "Resume received successfully. AI analysis coming soon.",
      file: {
        name: req.file.originalname,
        sizeKB: fileSizeKB,
        mimeType: req.file.mimetype,
      },
      jobDescription: {
        wordCount,
        preview: jobDescription.trim().slice(0, 120) + (jobDescription.length > 120 ? "…" : ""),
      },
    };

    return res.status(200).json(result);
  } catch (err) {
    console.error("Error in /api/review:", err.message);
    return res.status(500).json({ error: "Internal server error." });
  }
});

// ── Multer error handler (file type / size violations) ──
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ error: "File is too large. Maximum size is 5 MB." });
    }
    return res.status(400).json({ error: err.message });
  }
  if (err) {
    return res.status(400).json({ error: err.message });
  }
  next();
});

app.listen(PORT, () => {
  console.log(`Resume Reviewer running at http://localhost:${PORT}`);
});
