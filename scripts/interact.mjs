// Smoke-test the interactive pieces and screenshot each state.
import { chromium } from "playwright";
const [base, out] = process.argv.slice(2);
const b = await chromium.launch();
const errors = [];
const log = (...a) => console.log(...a);

// Mobile menu
{
  const p = await b.newPage({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true });
  p.on("pageerror", (e) => errors.push(String(e)));
  await p.goto(base + "/", { waitUntil: "networkidle" });
  await p.waitForTimeout(2500);
  await p.getByRole("button", { name: "Menu" }).click();
  await p.waitForTimeout(1300);
  await p.screenshot({ path: `${out}/i-mobilemenu.png` });
  log("mobile menu dialog visible:", await p.getByRole("dialog").isVisible());
  await p.getByRole("dialog").getByRole("link", { name: "Gallery" }).click();
  await p.waitForURL("**/gallery/");
  await p.waitForTimeout(1200);
  log("navigated to:", new URL(p.url()).pathname, "menu closed:", !(await p.getByRole("dialog").isVisible().catch(() => false)));
  await p.close();
}
// Menu tabs (Flip)
{
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  p.on("pageerror", (e) => errors.push(String(e)));
  await p.goto(base + "/menu/", { waitUntil: "networkidle" });
  await p.waitForTimeout(2500);
  const count = () => p.locator(".mb-item").count();
  log("menu items (Everything):", await count());
  await p.getByRole("tab", { name: "Breads" }).click();
  await p.waitForTimeout(1500);
  log("menu items (Breads):", await count());
  await p.getByRole("tab", { name: "Breads" }).focus();
  await p.keyboard.press("ArrowRight");
  await p.waitForTimeout(1500);
  log("after ArrowRight selected:", await p.locator("[role=tab][aria-selected=true]").textContent(), "items:", await count());
  await p.locator("#menu-panel").scrollIntoViewIfNeeded();
  await p.screenshot({ path: `${out}/i-menutabs.png` });
  await p.close();
}
// Gallery lightbox
{
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  p.on("pageerror", (e) => errors.push(String(e)));
  await p.goto(base + "/gallery/", { waitUntil: "networkidle" });
  await p.waitForTimeout(2500);
  await p.getByRole("button", { name: /Open photo: Party jollof/ }).click();
  await p.waitForTimeout(1000);
  log("lightbox open:", await p.getByRole("dialog").isVisible(), "caption:", await p.getByRole("dialog").getAttribute("aria-label"));
  await p.keyboard.press("ArrowRight");
  await p.waitForTimeout(900);
  log("after ArrowRight:", await p.getByRole("dialog").getAttribute("aria-label"));
  await p.screenshot({ path: `${out}/i-lightbox.png` });
  await p.keyboard.press("Escape");
  await p.waitForTimeout(900);
  log("closed with Escape:", !(await p.getByRole("dialog").isVisible().catch(() => false)), "focus on:", await p.evaluate(() => document.activeElement?.getAttribute("aria-label")));
  await p.close();
}
// Order form validation
{
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  p.on("pageerror", (e) => errors.push(String(e)));
  await p.goto(base + "/order/", { waitUntil: "networkidle" });
  await p.waitForTimeout(2500);
  await p.getByRole("button", { name: "Send enquiry" }).click();
  await p.waitForTimeout(700);
  log("errors shown:", await p.locator("[id$=-error]").count(), "focused:", await p.evaluate(() => document.activeElement?.getAttribute("name")));
  await p.locator("form").scrollIntoViewIfNeeded();
  await p.screenshot({ path: `${out}/i-form-errors.png` });
  await p.fill("[name=name]", "Ama Mensah");
  await p.fill("[name=phone]", "+233 20 000 0000");
  await p.fill("[name=date]", "2027-01-15");
  await p.fill("[name=details]", "50 small chops packs for a birthday");
  await p.getByRole("button", { name: "Send enquiry" }).click();
  await p.waitForTimeout(1500);
  log("after valid submit:", await p.getByRole("status").textContent().catch(() => "no status"));
  await p.screenshot({ path: `${out}/i-form-done.png` });
  await p.close();
}
log(errors.length ? "!! page errors:\n" + errors.join("\n") : "no page errors");
await b.close();
