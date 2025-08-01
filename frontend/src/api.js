// een centrale plek voor al je fetch-calls
const BASE = "https://us-central1-ai4all-platform-fe2e4.cloudfunctions.net";

export async function generateImage(prompt) {
  const res = await fetch(`${BASE}/generateImage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });
  return res.json();
}

export async function fetchImages() {
  const res = await fetch(`${BASE}/getImages`);
  return res.json();
}
