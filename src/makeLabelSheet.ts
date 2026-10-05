import { readFileSync, writeFileSync, existsSync } from "node:fs";

if (existsSync("data/labels.json")) throw new Error("labels.json exists - delete it only if you want a new sample");

const jobs = JSON.parse(readFileSync("data/jobs-unique.json", "utf8")).slice(5);
const sample = jobs
  .map((j: any) => ({ j, r: Math.random() }))
  .sort((a: any, b: any) => a.r - b.r)
  .slice(0, 30)
  .map((x: any) => x.j);

writeFileSync("data/labels.json", JSON.stringify(sample.map((j: any) => ({
  id: j.id, title: j.title,
  seniority: "", employment_type: "", languages_required: [], location_restricted: null,
})), null, 2));

writeFileSync("data/to-label.txt", sample.map((j: any, i: number) =>
  `#${i + 1}  ${j.id}\n${j.title}\n\n${j.description}\n\n=\n`).join("\n"));
