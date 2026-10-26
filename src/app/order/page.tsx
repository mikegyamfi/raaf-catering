import type { Metadata } from "next";
import { JsonLd, breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { PageIntro } from "@/components/layout/PageIntro";
import { OrderForm } from "@/components/order/OrderForm";
import { ContactList } from "@/components/layout/Footer";
import { HoursList, OpenStatus } from "@/components/ui/OpenStatus";
import { Button } from "@/components/ui/Button";
import { Illo as Illustration } from "@/components/illustrations/Illo";
import { RevealGroup } from "@/components/motion/Reveal";
import { business, isPlaceholder, whatsappHref, telHref } from "@/lib/content";

export const metadata: Metadata = pageMetadata({
  title: "Order",
  description: "Order pastries, small chops packs, cakes, breads and Ghanaian meals for your event. Tell RAAF Catering the date, your guests and what you'd love.",
  path: "/order/",
  image: "og/order.jpg",
});

export default function OrderPage() {
  const wa = whatsappHref();
  const tel = telHref();
  const hasAddress = !isPlaceholder(business.address);
  const mapQuery = encodeURIComponent(hasAddress ? business.address : business.area);

  return (
    <>
      <JsonLd data={breadcrumbJsonLd("Order", "/order/")} />
      <PageIntro title="Let's plan your order" lead="Tell us the date, the number of guests and what you'd love on the table. We'll come back to you to confirm the details." illustration="cake">
        <div className="mt-8 flex flex-wrap gap-3">
          {wa ? (
            <Button href={wa} variant="primary">
              Chat on WhatsApp
            </Button>
          ) : null}
          {tel ? (
            <Button href={tel} variant="ghost">
              Call us
            </Button>
          ) : null}
          <OpenStatus />
        </div>
      </PageIntro>

      <section className="pb-28 md:pb-40" aria-labelledby="form-title">
        <div className="shell grid gap-16 md:grid-cols-12 md:gap-[var(--gutter)]">
          <div className="md:col-span-7">
            <h2 id="form-title" className="text-step-4">
              Send an enquiry
            </h2>
            <div className="mt-10">
              <OrderForm />
            </div>
          </div>

          <aside className="space-y-10 md:col-span-4 md:col-start-9" aria-label="Contact details">
            <RevealGroup className="rounded-[28px] bg-flour-deep p-8">
              <h2 data-stagger className="text-step-2">
                Get in touch
              </h2>
              <div data-stagger>
                <ContactList className="mt-4 text-[0.95rem]" />
              </div>
            </RevealGroup>

            <div className="rounded-[28px] bg-flour-deep p-8">
              <h2 className="text-step-2">Hours</h2>
              <OpenStatus className="mt-4 bg-flour" />
              <HoursList className="mt-4 text-[0.95rem] text-cocoa/75" />
            </div>

            <div className="rounded-[28px] bg-flour-deep p-8">
              <h2 className="text-step-2">Good to know</h2>
              <ul className="mt-4 space-y-3 text-[0.95rem] text-cocoa/80">
                <li>RAAF is a home-based catering business, so every order is arranged ahead with us.</li>
                <li>{isPlaceholder(business.leadTime) ? "Order ahead where you can, especially for big events." : `Please order ${business.leadTime} ahead.`}</li>
                {!isPlaceholder(business.deliveryArea) ? <li>Delivery: {business.deliveryArea}.</li> : null}
              </ul>
            </div>

            {/* Map: shows once an area or address is added in content.ts */}
            {!isPlaceholder(business.area) || hasAddress ? (
              <div className="overflow-hidden rounded-[28px]">
                <iframe
                  title={`Map showing ${hasAddress ? business.address : business.area}`}
                  src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="aspect-[4/3] w-full border-0"
                />
              </div>
            ) : (
              <div className="relative overflow-hidden rounded-[28px] bg-[#efe2c9] p-8">
                <svg aria-hidden viewBox="0 0 300 200" className="absolute inset-0 h-full w-full opacity-20">
                  <path d="M0 140 C60 120 90 160 150 130 C210 100 240 140 300 120" stroke="#c7832c" strokeWidth="3" fill="none" />
                  <path d="M40 0 C60 60 30 120 70 200 M200 0 C180 70 230 130 210 200" stroke="#fbf6ee" strokeWidth="10" fill="none" />
                  <path d="M0 60 L300 80" stroke="#fbf6ee" strokeWidth="6" />
                </svg>
                <div className="relative flex items-center gap-4">
                  <Illustration name="table" className="h-16 w-16 shrink-0" />
                  <p className="text-[0.95rem] text-cocoa/80">A map will appear here once our location is added.</p>
                </div>
              </div>
            )}
          </aside>
        </div>
      </section>
    </>
  );
}
