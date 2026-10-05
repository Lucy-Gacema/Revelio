import { readFileSync, writeFileSync } from "node:fs";

const jobs = JSON.parse(readFileSync("data/jobs.json", "utf8"));

const seen = new Set<string>();
const unique = [];

for (const job of jobs) {
  const fingerprint = `${job.title}|${job.company}|${job.location}`.toLowerCase();
  if (seen.has(fingerprint)) {
    console.log(`duplicate removed: ${job.title} (${job.company})`);
    continue;
  }
  seen.add(fingerprint);
  unique.push(job);
}

writeFileSync("data/jobs-unique.json", JSON.stringify(unique, null, 2));
