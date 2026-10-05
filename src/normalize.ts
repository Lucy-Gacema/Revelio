import { readFileSync, writeFileSync } from "node:fs";
import { convert } from "html-to-text";

const raw = JSON.parse(readFileSync("data/jobicy-raw.json", "utf8"));

const jobs = raw.map((j: any) => ({
  id: `jobicy-${j.id}`,
  source: "jobicy",
  title: j.jobTitle.trim(),
  company: j.companyName.trim(),
  location: j.jobGeo.replace(/\s+/g, " ").trim(),
  date: j.pubDate,
  url: j.url,
  description: convert(j.jobDescription, {
    wordwrap: false,
    selectors: [{ selector: "a", options: { ignoreHref: true } }],
  }),
}));

writeFileSync("data/jobs.json", JSON.stringify(jobs, null, 2));
