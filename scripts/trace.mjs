// Record a 4x-throttled timeline trace and break down tasks longer than 100ms.
import { chromium } from "playwright";
const [url] = process.argv.slice(2);
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 412, height: 823 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
const p = await ctx.newPage();
const cdp = await ctx.newCDPSession(p);
await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
const events = [];
cdp.on("Tracing.dataCollected", (d) => events.push(...d.value));
const done = new Promise((r) => cdp.once("Tracing.tracingComplete", r));
await cdp.send("Tracing.start", { categories: "devtools.timeline,disabled-by-default-devtools.timeline,v8.execute", transferMode: "ReportEvents" });
await p.goto(url, { waitUntil: "load" });
await p.waitForTimeout(7000);
await cdp.send("Tracing.end");
await done;
const tasks = events.filter((e) => e.name === "RunTask" && e.dur > 100000);
const t0 = Math.min(...events.filter((e) => e.ts).map((e) => e.ts));
for (const t of tasks) {
  const inside = events.filter((e) => e.tid === t.tid && e.ts >= t.ts && e.ts + (e.dur || 0) <= t.ts + t.dur && e.dur > 8000 && e.name !== "RunTask");
  console.log(`\nTASK @${Math.round((t.ts - t0) / 1000)}ms ${Math.round(t.dur / 1000)}ms`);
  for (const e of inside.slice(0, 14)) console.log(`   ${Math.round(e.dur / 1000)}ms ${e.name} ${e.args?.data?.functionName || e.args?.data?.type || e.args?.data?.url?.split("/").pop() || ""}`);
}
await b.close();
