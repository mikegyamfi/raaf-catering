// Print heaviest call paths (total time) beneath a named function in a throttled load.
import { chromium } from "playwright";
const [url, fname = "z"] = process.argv.slice(2);
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 412, height: 823 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
const p = await ctx.newPage();
const cdp = await ctx.newCDPSession(p);
await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
await cdp.send("Profiler.enable");
await cdp.send("Profiler.setSamplingInterval", { interval: 200 });
await cdp.send("Profiler.start");
await p.goto(url, { waitUntil: "load" });
await p.waitForTimeout(7000);
const { profile } = await cdp.send("Profiler.stop");
const byId = new Map(profile.nodes.map((n) => [n.id, { ...n, self: 0 }]));
profile.samples.forEach((id, i) => (byId.get(id).self += (profile.timeDeltas[i] || 0) / 1000));
const total = (n) => n.self + (n.children || []).reduce((s, c) => s + total(byId.get(c)), 0);
const label = (n) => `${n.callFrame.functionName || "(anon)"} ${n.callFrame.url.split("/").pop()}:${n.callFrame.columnNumber}`;
const show = (n, depth, max) => {
  if (depth > max) return;
  const t = total(n);
  if (t < 25) return;
  console.log(`${"  ".repeat(depth)}${Math.round(t)}ms ${label(n)}`);
  (n.children || []).map((c) => byId.get(c)).sort((a, b) => total(b) - total(a)).forEach((c) => show(c, depth + 1, max));
};
for (const n of byId.values()) if (n.callFrame.functionName === fname && total(n) > 100) show(n, 0, 9);
await b.close();
