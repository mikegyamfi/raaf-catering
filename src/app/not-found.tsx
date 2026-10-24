import { Illo as Illustration } from "@/components/illustrations/Illo";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="shell flex min-h-[80svh] flex-col items-start justify-center pb-20 pt-40">
      <Illustration name="rockBun" className="float-soft h-32 w-32" />
      <h1 className="mt-8 text-step-6">This page isn&rsquo;t on the menu.</h1>
      <p className="measure mt-6 text-step-1 text-cocoa/75">The link may be old or mistyped. Everything we make is a tap away from here.</p>
      <div className="mt-10 flex flex-wrap gap-3">
        <Button href="/">Back to home</Button>
        <Button href="/menu/" variant="ghost">
          See the menu
        </Button>
      </div>
    </section>
  );
}
