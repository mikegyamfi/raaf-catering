// Heaviest stacks during a time window of a throttled page load.
import { chromium } from "playwright";
const [url, from = "3000", to = "6500"] = process.argv.slice(2);
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 412, height: 823 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
const p = await ctx.newPage();
const cdp = await ctx.newCDPSession(p);
await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
await cdp.send("Profiler.enable");
await cdp.send("Profiler.setSamplingInterval", { interval: 200 });
await cdp.send("Profiler.start");
await p.goto(url, { waitUntil: "load" });
await p.waitForTimeout(8000);
const { profile } = await cdp.send("Profiler.stop");
const parent = new Map();
const byId = new Map(profile.nodes.map((n) => [n.id, n]));
for (const n of profile.nodes) for (const c of n.children || []) parent.set(c, n.id);
const lbl = (n) => `${n.callFrame.functionName || "(anon)"}@${n.callFrame.url.split("/").pop()}:${n.callFrame.columnNumber}`;
let t = profile.startTime;
const agg = new Map();
profile.samples.forEach((id, i) => {
  t += profile.timeDeltas[i];
  const ms = (t - profile.startTime) / 1000;
  if (ms < +from || ms > +to) return;
  let n = byId.get(id);
  if (n.callFrame.functionName === "(idle)" || n.callFrame.functionName === "(program)") return;
  const chain = [];
  while (n && chain.length < 7) {
    chain.push(lbl(n));
    n = byId.get(parent.get(n.id));
  }
  const key = chain.join(" < ");
  agg.set(key, (agg.get(key) || 0) + profile.timeDeltas[i] / 1000);
});
[...agg.entries()].sort((a, b) => b[1] - a[1]).slice(0, 12).forEach(([k, v]) => console.log(Math.round(v) + "ms  " + k + "\n"));
await b.close();
