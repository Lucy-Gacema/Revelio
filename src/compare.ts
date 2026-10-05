import { readFileSync } from "node:fs";

const labels = JSON.parse(readFileSync("data/labels.json", "utf8"));
const ai = JSON.parse(readFileSync("data/ai-sample.json", "utf8"));

const norm = (list: string[]) => JSON.stringify(list.map((s) => s.toLowerCase().trim()).sort());
const fields = ["seniority", "employment_type", "location_restricted", "languages_required"];
const correct = Object.fromEntries(fields.map((f) => [f, 0])) as Record<string, number>;
for (const f of fields) correct[f] = 0;

for (const mine of labels) {
  const model = ai.find((a: any) => a.id === mine.id);
  for (const f of fields) {
    const same = f === "languages_required"
      ? norm(mine[f]) === norm(model[f])
      : mine[f] === model[f];
    if (same) correct[f]!++;
    else console.log(`${mine.title} | ${f} | you: ${JSON.stringify(mine[f])} | model: ${JSON.stringify(model[f])}`);
  }
}

console.log("");
for (const f of fields) {
  console.log(`${f}: ${correct[f]}/${labels.length} (${Math.round((correct[f]! / labels.length) * 100)}%)`);
}