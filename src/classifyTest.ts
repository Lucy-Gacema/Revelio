import { readFileSync } from "node:fs";

const KEY = process.env.GEMINI_API_KEY!;
const MODEL = "gemini-3.5-flash-lite";
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const schema = {
  type: "OBJECT",
  properties: {
    seniority: { type: "STRING", enum: ["intern/junior", "mid", "senior", "lead/manager", "unclear"] },
    employment_type: { type: "STRING", enum: ["full-time", "part-time", "contract/freelance", "internship", "unclear"] },
    languages_required: { type: "ARRAY", items: { type: "STRING" } },
    location_restricted: { type: "BOOLEAN" },
    location_detail: { type: "STRING" },
    skills: { type: "ARRAY", items: { type: "STRING" } },
  },
  required: ["seniority", "employment_type", "languages_required", "location_restricted", "location_detail", "skills"],
};

const instructions = `Read this job posting and fill in the fields.
- seniority: the level the posting asks for. Use "unclear" if it does not say.
- employment_type: the kind of work arrangement. Use "unclear" if it does not say.
- languages_required: languages OTHER than English that are required (not just preferred). Empty list if none.
- location_restricted: true only if the candidate must live in, or be authorised to work in, a specific country or region.
- location_detail: that restriction in a few words, or an empty string.
- skills: up to 10 specific skills or tools the posting asks for.`;

const jobs = JSON.parse(readFileSync("data/jobs-unique.json", "utf8")).slice(0, 5);

for (const job of jobs) {
  const text = `${instructions}\n\nTitle: ${job.title}\n\n${job.description.slice(0, 6000)}`;
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
    {
      method: "POST",
      headers: { "x-goog-api-key": KEY, "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text }] }],
        generationConfig: { responseMimeType: "application/json", responseSchema: schema },
      }),
    }
  );
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  
  await sleep(5000);
}