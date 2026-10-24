"use client";

import { useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { business, isPlaceholder, whatsappHref, mailHref } from "@/lib/content";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

/**
 * Where enquiries go.
 * ─────────────────────────────────────────────────────────────
 * PLACEHOLDER: no form backend yet. Paste a form endpoint here (for example
 * a Formspree or Basin URL: "https://formspree.io/f/xxxxxxx") and the form will
 * POST JSON to it. Until then the form hands the enquiry to WhatsApp or
 * email, whichever is filled in content.ts.
 */
const ORDER_ENDPOINT = ""; // {{FORM_ENDPOINT}}

const occasions = ["Birthday", "Wedding", "Naming ceremony", "Office or meeting", "Party", "Something else"];
const wants = ["Pastries", "Small chops packs", "Breads", "Cakes", "Meals"];

type Errors = Partial<Record<"name" | "phone" | "email" | "date" | "details", string>>;

function FieldError({ id, message }: { id: string; message?: string }) {
  return (
    <AnimatePresence>
      {message ? (
        <motion.p id={`${id}-error`} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-2 text-[0.88rem] font-medium text-[#a3361a]">
          {message}
        </motion.p>
      ) : null}
    </AnimatePresence>
  );
}

export function OrderForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "handoff" | "unavailable" | "error">("idle");

  const validate = (fd: FormData): Errors => {
    const e: Errors = {};
    const name = String(fd.get("name") || "").trim();
    const phone = String(fd.get("phone") || "").trim();
    const email = String(fd.get("email") || "").trim();
    const date = String(fd.get("date") || "");
    const details = String(fd.get("details") || "").trim();
    if (name.length < 2) e.name = "Enter your name so we know who to reply to.";
    if (!/^[+\d][\d\s()-]{6,}$/.test(phone)) e.phone = "Enter a phone number we can call or WhatsApp, e.g. +233 20 000 0000.";
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "That email address looks incomplete. Check it or leave it blank.";
    if (!date) e.date = "Choose the date you need the food.";
    else if (new Date(date + "T23:59") < new Date()) e.date = "Choose a date from today onwards.";
    if (details.length < 5) e.details = "Tell us a little about what you'd like, even a rough idea helps.";
    return e;
  };

  const summary = (fd: FormData) =>
    [
      `Hello RAAF, I'd like to place an order.`,
      ``,
      `Name: ${fd.get("name")}`,
      `Phone: ${fd.get("phone")}`,
      fd.get("email") ? `Email: ${fd.get("email")}` : "",
      `Occasion: ${fd.get("occasion")}`,
      `Date: ${fd.get("date")}`,
      fd.get("guests") ? `Guests: ${fd.get("guests")}` : "",
      fd.getAll("wants").length ? `Interested in: ${fd.getAll("wants").join(", ")}` : "",
      fd.get("address") ? `Delivery to: ${fd.get("address")}` : "",
      ``,
      `${fd.get("details")}`,
    ]
      .filter((l) => l !== "")
      .join("\n");

  const onSubmit = async (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    const fd = new FormData(ev.currentTarget);
    const e = validate(fd);
    setErrors(e);
    const first = Object.keys(e)[0];
    if (first) {
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setStatus("sending");

    if (ORDER_ENDPOINT) {
      try {
        const res = await fetch(ORDER_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ ...Object.fromEntries(fd.entries()), wants: fd.getAll("wants") }),
        });
        setStatus(res.ok ? "sent" : "error");
        if (res.ok) formRef.current?.reset();
      } catch {
        setStatus("error");
      }
      return;
    }

    const wa = whatsappHref(summary(fd));
    const mail = mailHref("Order enquiry");
    if (wa) {
      window.open(wa, "_blank", "noopener");
      setStatus("handoff");
    } else if (mail) {
      window.location.href = `${mail}&body=${encodeURIComponent(summary(fd))}`;
      setStatus("handoff");
    } else {
      setStatus("unavailable");
    }
  };

  const field = "mt-2 w-full rounded-2xl border-[1.5px] border-cocoa/15 bg-milk px-4 py-3.5 text-cocoa outline-none transition-[border-color,box-shadow] duration-300 placeholder:text-cocoa/45 focus:border-palm focus:shadow-[0_0_0_4px_rgba(31,61,44,0.12)]";
  const bad = "border-[#b33a1a] focus:border-[#b33a1a] focus:shadow-[0_0_0_4px_rgba(179,58,26,0.12)]";
  const a11y = (id: keyof Errors) => ({ "aria-invalid": !!errors[id] || undefined, "aria-describedby": errors[id] ? `${id}-error` : undefined });

  if (status === "sent" || status === "handoff" || status === "unavailable") {
    return (
      <div className="rounded-[28px] bg-flour-deep p-8 md:p-12" role="status">
        <svg viewBox="0 0 80 80" className="h-20 w-20" aria-hidden>
          <motion.circle cx="40" cy="40" r="36" fill="none" stroke="#1f3d2c" strokeWidth="4" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} />
          <motion.path d="M24 41 L35 52 L57 29" fill="none" stroke="#1f3d2c" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }} />
        </svg>
        <h3 className="mt-6 text-step-3">{status === "unavailable" ? "Almost there" : status === "handoff" ? "Your message is ready" : "Enquiry sent"}</h3>
        <p className="measure mt-4 text-cocoa/80">
          {status === "sent" && "Thank you. We've received your enquiry and will be in touch to confirm the details."}
          {status === "handoff" && "We've opened your message with all the details filled in. Just press send and we'll take it from there."}
          {status === "unavailable" && "Our online ordering line is still being set up. Please check back soon. Your details have not been sent anywhere."}
        </p>
        <div className="mt-8">
          <Button variant="ghost" onClick={() => setStatus("idle")}>
            Start a new enquiry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form ref={formRef} noValidate onSubmit={onSubmit} className="grid gap-6 md:grid-cols-2" aria-describedby="form-note">
      <label className="block">
        <span className="font-medium">Your name</span>
        <input name="name" autoComplete="name" className={cn(field, errors.name && bad)} {...a11y("name")} />
        <FieldError id="name" message={errors.name} />
      </label>
      <label className="block">
        <span className="font-medium">Phone or WhatsApp</span>
        <input name="phone" type="tel" autoComplete="tel" inputMode="tel" className={cn(field, errors.phone && bad)} {...a11y("phone")} />
        <FieldError id="phone" message={errors.phone} />
      </label>
      <label className="block">
        <span className="font-medium">
          Email <span className="font-normal text-cocoa/70">(optional)</span>
        </span>
        <input name="email" type="email" autoComplete="email" className={cn(field, errors.email && bad)} {...a11y("email")} />
        <FieldError id="email" message={errors.email} />
      </label>
      <label className="block">
        <span className="font-medium">Date you need it</span>
        <input name="date" type="date" className={cn(field, errors.date && bad)} {...a11y("date")} />
        <FieldError id="date" message={errors.date} />
      </label>
      <label className="block">
        <span className="font-medium">Occasion</span>
        <select name="occasion" className={field} defaultValue={occasions[0]}>
          {occasions.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="font-medium">
          Number of guests <span className="font-normal text-cocoa/70">(roughly)</span>
        </span>
        <input name="guests" type="number" min={1} inputMode="numeric" className={field} />
      </label>

      <fieldset className="md:col-span-2">
        <legend className="font-medium">What would you like?</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {wants.map((w) => (
            <label key={w} className="group relative cursor-pointer">
              <input type="checkbox" name="wants" value={w} className="peer sr-only" />
              <span className="inline-flex rounded-full border-[1.5px] border-cocoa/15 bg-milk px-4 py-2 text-[0.95rem] transition-colors duration-300 peer-checked:border-palm peer-checked:bg-palm peer-checked:text-flour peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-palm">
                {w}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <label className="block md:col-span-2">
        <span className="font-medium">
          Delivery address <span className="font-normal text-cocoa/70">(if you&rsquo;d like it delivered)</span>
        </span>
        <input name="address" autoComplete="street-address" className={field} />
      </label>

      <label className="block md:col-span-2">
        <span className="font-medium">Tell us about your order</span>
        <textarea name="details" rows={5} placeholder="e.g. 50 small chops packs and a vanilla cake for a birthday on Saturday afternoon" className={cn(field, "resize-y", errors.details && bad)} {...a11y("details")} />
        <FieldError id="details" message={errors.details} />
      </label>

      <div className="flex flex-wrap items-center gap-5 md:col-span-2">
        <Button type="submit" disabled={status === "sending"}>
          {status === "sending" ? "Sending…" : "Send enquiry"}
        </Button>
        <p id="form-note" className="max-w-[46ch] text-[0.9rem] text-cocoa/65">
          {ORDER_ENDPOINT
            ? "We'll reply to confirm availability and price."
            : !isPlaceholder(business.whatsapp)
              ? "This opens WhatsApp with your details filled in, ready to send."
              : "We'll reply to confirm availability and price."}
        </p>
        {status === "error" ? <p className="w-full font-medium text-[#a3361a]">The enquiry didn&rsquo;t go through. Check your connection and try again.</p> : null}
      </div>
    </form>
  );
}
