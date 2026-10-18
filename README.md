# AI Resume Reviewer (ResumeAI)

An intelligent, full-stack web application designed to help job seekers tailor and optimize their resumes for Applicant Tracking Systems (ATS) and hiring managers. Powered by ultra-fast LLM inference using the Groq SDK and local text-parsing heuristics.

---

## Key Features

- **PDF Text Extraction**: Securely reads and parses text directly from uploaded PDF resumes in-memory using `pdf-parse` (no files permanently stored on disk).
- **ATS Keyword Matching and Scoring**:
  - Automatically compares job description requirements with your resume.
  - Highlights matched keywords versus missing critical competencies.
  - Computes an instant ATS match percentage score.
- **Deep AI Feedback**:
  - Powered by Groq's high-speed inference engine (`openai/gpt-oss-120b`).
  - Delivers an honest suitability summary, identified strengths, and actionable improvement recommendations.
- **Bullet Point Transformation**:
  - Automatically identifies a weak or vague bullet point from your resume.
  - Generates a compelling, high-impact rewrite using strong action verbs and quantified impact metrics.
- **Light / Dark Mode**: Built-in theme switcher with persistent local storage preferences and zero flash on load.
- **One-Click Windows Launcher**: Includes `Start Resume Reviewer.bat` for instant single-click setup, dependency checking, and automatic browser launch.

---

## Tech Stack

- **Backend**: [Node.js](https://nodejs.org/) and [Express.js](https://expressjs.com/)
- **AI Engine**: [Groq SDK](https://console.groq.com/) (`groq-sdk`)
- **PDF Processing**: [pdf-parse](https://www.npmjs.com/package/pdf-parse) and [multer](https://www.npmjs.com/package/multer)
- **Frontend**: Vanilla HTML5, Modern CSS3 (Custom design system with CSS variables and responsive layout), and Vanilla JavaScript
- **Typography**: Google Fonts (Inter)

---

## Project Structure

```text
AI-resume-reviewer/
├── Start Resume Reviewer.bat  # Windows one-click launcher
├── server.js                  # Express server, PDF parsing and Groq API integration
├── index.html                 # Frontend user interface
├── styles.css                 # Responsive stylesheet with light/dark theme tokens
├── app.js                     # Client-side UI logic, drag and drop, and API requests
├── package.json               # Node.js project metadata and dependencies
├── .env.example               # Template for environment variables
└── README.md                  # Project documentation
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or higher recommended)
- A free [Groq Cloud API Key](https://console.groq.com/keys)

---

### Installation and Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Sn3h4DEV/AI-resume-reviewer.git
   cd AI-resume-reviewer
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory by copying `.env.example`:
   ```bash
   cp .env.example .env
   ```
   Open `.env` and add your Groq API key:
   ```env
   GROQ_API_KEY=your_actual_groq_api_key_here
   ```

---

### Running the Application

#### Option A: Windows One-Click Launch (Recommended on Windows)
Double-click `Start Resume Reviewer.bat`.
This script will:
1. Verify Node.js is installed.
2. Install dependencies automatically if missing.
3. Start the Express server.
4. Open http://localhost:3000 automatically in your default browser.

#### Option B: Terminal
```bash
npm start
# or
node server.js
```
The application will launch and be accessible at:
[http://localhost:3000](http://localhost:3000)

---

## How It Works

1. **Upload and Parse**: The candidate uploads their resume in PDF format (up to 5 MB) along with the target job description.
2. **Local Tokenization and Stop-word Filtering**: The system parses the PDF in memory, sanitizes text, and extracts core technical and professional keywords.
3. **Keyword Intersection**: Calculates match ratio, identifying high-frequency skills present or missing.
4. **Groq LLM Analysis**: The sanitized resume and job description are submitted to Groq for structured JSON evaluation.
5. **Results Presentation**: A visual score ring, interactive tags, structured critique, and before/after bullet rewrites are rendered dynamically on the dashboard.

---

## API Reference

### `POST /api/review`
Processes a resume PDF and job description to generate an ATS review.

- **Request Type**: `multipart/form-data`
- **Fields**:
  - `resume`: Binary PDF file (Max 5 MB)
  - `jobDescription`: Text string
- **Response Format**: `application/json`
  ```json
  {
    "score": 85,
    "scoreCategory": "Strong Match",
    "scoreDescription": "Your resume aligns well with key requirements.",
    "matchedKeywords": ["Node.js", "Express", "REST APIs"],
    "missingKeywords": ["Docker", "Kubernetes"],
    "aiFeedback": {
      "overallFit": "Good alignment with backend engineering responsibilities.",
      "strengths": ["Clear project descriptions", "Relevant stack experience"],
      "improvements": ["Add containerization experience", "Quantify metrics"],
      "rewrittenBullet": {
        "original": "Worked on backend APIs using Node.js.",
        "rewritten": "Designed and deployed 15+ secure RESTful APIs using Node.js and Express, improving response times by 25%."
      }
    }
  }
  ```

---

## Security and Privacy

- **In-Memory Buffer**: Uploaded PDF files are held temporarily in memory with `multer.memoryStorage()` for text extraction and are never saved to disk.
- **Secret Protection**: `.env` is explicitly ignored in `.gitignore` to prevent secret leaks.

---

## Contributing

Contributions, issues, and feature requests are welcome.
Feel free to open an issue or submit a Pull Request.

---

## License

This project is licensed under the [MIT License](LICENSE) (or applicable open-source license).
