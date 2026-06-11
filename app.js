const form = document.getElementById("review-form");
const resultsSection = document.getElementById("results");
const resultsContent = document.getElementById("results-content");
const submitBtn = document.getElementById("submit-btn");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const file = document.getElementById("resume-upload").files[0];
  const jobDescription = document.getElementById("job-description").value.trim();

  if (!file || !jobDescription) return;

  // Build multipart form data to send to the API
  const formData = new FormData();
  formData.append("resume", file);
  formData.append("jobDescription", jobDescription);

  // Update UI to loading state
  submitBtn.disabled = true;
  submitBtn.textContent = "Analyzing...";
  resultsSection.classList.add("hidden");
  resultsContent.textContent = "";

  try {
    const response = await fetch("/api/review", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      // Server returned a 4xx / 5xx with an error message
      resultsContent.textContent = `Error: ${data.error || "Something went wrong."}`;
    } else {
      // Format the successful response for display
      resultsContent.textContent = [
        `✅ ${data.message}`,
        "",
        `📄 File: ${data.file.name} (${data.file.sizeKB} KB)`,
        `📝 Job description: ${data.jobDescription.wordCount} words`,
        `   "${data.jobDescription.preview}"`,
      ].join("\n");
    }
  } catch (err) {
    // Network-level failure
    resultsContent.textContent = `Network error: ${err.message}`;
  } finally {
    resultsSection.classList.remove("hidden");
    submitBtn.disabled = false;
    submitBtn.textContent = "Analyze";
  }
});
