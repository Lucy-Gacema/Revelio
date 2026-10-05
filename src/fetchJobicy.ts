import { mkdirSync, writeFileSync } from "node:fs";

const USER_AGENT = "job-scraper-student-project (learning project)";
const DELAY_MS = 2000;
const INDUSTRIES = ["engineering", "marketing", "data-science"];

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const byId = new Map<number, any>(); 

for (const industry of INDUSTRIES) {
  let cursor: string | null = null;

  while (true) {
    const url = new URL("https://jobicy.com/api/v2/remote-jobs");
    url.searchParams.set("count", "100");
    url.searchParams.set("industry", industry);
    if (cursor) url.searchParams.set("cursor", cursor);

    const res = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    for (const job of data.jobs) byId.set(job.id, job);
    console.log(`${industry}: ${byId.size} unique jobs so far`);

    cursor = data.nextCursor;
    if (!cursor) break;
    await sleep(DELAY_MS);
  }
  await sleep(DELAY_MS);
}

mkdirSync("data", { recursive: true });
writeFileSync("data/jobicy-raw.json", JSON.stringify([...byId.values()], null, 2));
