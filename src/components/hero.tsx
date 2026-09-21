import { ProofVideo } from "@/components/ProofVideo";
import { EmailCapture } from "@/components/email-capture";
import { LogoCycle } from "@/components/logo-cycle";
import { SiteNav } from "@/components/site-nav";
import { StackStrip } from "@/components/stack-strip";

export function Hero() {
  return (
    <section
      id="top"
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-background"
    >
      {/* backdrop */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="grid-field" />
      </div>

      <SiteNav />

      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col items-center px-6 pt-10 text-center sm:pt-12">
        <h1 className="rise whitespace-nowrap font-brand text-[clamp(1.15rem,4.9vw,4.5rem)] leading-[1.08] tracking-[-0.03em]">
          <span className="font-normal text-white/55">Ship fast</span>
          <LogoCycle />
          <span className="font-semibold text-white">stay covered.</span>
        </h1>

        <p
          className="rise mt-5 max-w-2xl text-balance text-base leading-relaxed text-white/55 sm:text-lg lg:max-w-none lg:whitespace-nowrap"
          style={{ animationDelay: "80ms" }}
        >
          Security that runs inside your pipeline, on every project you build.
        </p>

        <div className="rise w-full" style={{ animationDelay: "160ms" }}>
          <ProofVideo />
        </div>

        <div
          className="rise mt-6 w-full"
          style={{ animationDelay: "240ms" }}
        >
          <EmailCapture />
        </div>
      </div>

      <StackStrip />
    </section>
  );
}
