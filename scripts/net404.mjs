// Lists any failed (4xx/5xx) requests on a page.
import { chromium } from "playwright";
const [url, w = "1440"] = process.argv.slice(2);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: +w, height: 900 } });
p.on("response", (r) => r.status() >= 400 && console.log(r.status(), r.url()));
await p.goto(url, { waitUntil: "networkidle" });
await p.waitForTimeout(3000);
await b.close();
