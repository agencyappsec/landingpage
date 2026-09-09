import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

import { SiteNav } from "@/components/site-nav";
import { dataRights, legal, processors } from "@/lib/legal";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: `Privacy policy | ${site.name}`,
  description:
    "What happens to your information when you use this website: what is collected, who processes it, how long it is kept, and how to have it deleted.",
};

export default function Privacy() {
  return (
    <>
      <BackArrow />
      <SiteNav href="/" />
      <main className="w-full flex-1 px-6 pt-16 pb-24 sm:pt-20 sm:pb-32">
        <article className="mx-auto max-w-3xl">
          <h1 className="font-brand text-[clamp(1.9rem,4vw,3rem)] leading-[1.1] font-semibold tracking-[-0.03em] text-white">
            Privacy Policy
          </h1>
          <p className="mt-4 font-mono text-xs tracking-[0.06em] text-white/35">
            Last updated: {legal.lastUpdated}
          </p>

          <P className="mt-10">
            This policy explains what happens to your information when you use
            this website. It covers the website only. If you go on to engage me
            for a security audit, how I handle your systems and any data I
            encounter during that work is governed separately by our written
            scope and authorization agreement, and by any NDA we sign.
          </P>

          <H2>Who is responsible for your data</H2>
          <P>
            {legal.businessName}, {legal.address}, Ireland.
          </P>
          <P>
            I am the data controller for the information described below. You
            can reach me at <Mail /> about anything in this policy.
          </P>

          <H2>What I collect, and why</H2>

          <H3>The fit form</H3>
          <P>
            If you fill in the form on this site, I collect what you enter: your
            name, your work email address, what kind of organisation you are,
            what you built your application with, what backend you’re using, and
            where you are in your build.
          </P>
          <P>
            I use this for one thing: deciding whether I can help you and
            replying to you. If it’s a fit, you’re offered a call. If it isn’t, I
            tell you so and send you the written teardown if you want it.
          </P>
          <Basis>
            legitimate interests, responding to a business enquiry you
            initiated. Where I send you the teardown or any follow-up material,
            that’s on the basis of your request.
          </Basis>
          <P>
            I do not add you to a marketing list, put you into an automated email
            sequence, sell your details, or share them with anyone for their own
            marketing.
          </P>

          <H3>Booking a call</H3>
          <P>
            Calls are booked through Cal.com, which is a separate service with
            its own privacy policy. When you book, you give Cal.com your name,
            email address and whatever else their form asks for, and they pass
            the booking details to me. Their handling of that information is
            governed by their policy, not this one.
          </P>
          <Basis>legitimate interests, arranging a meeting you asked for.</Basis>

          <H3>Video</H3>
          <P>
            Videos on this site are hosted by Wistia. When a video loads, Wistia
            sets cookies and records viewing information, including your IP
            address, which parts of the video were watched, and an identifier for
            your browser. I use the aggregate version of this to understand which
            parts of the video people watch and where they stop.
          </P>
          <Basis>
            consent, where required for non-essential cookies. If you decline or
            block those cookies, the video still plays.
          </Basis>
          <P>
            Wistia’s own privacy policy governs what they do with that
            information as a service provider.
          </P>

          <H3>Server logs</H3>
          <P>
            This site is hosted on Vercel. Like any web host, it records standard
            technical information when a page is requested: IP address, browser
            type, the page requested and the time. This happens automatically and
            is used for security and keeping the site running.
          </P>
          <Basis>
            legitimate interests, operating and securing the website.
          </Basis>

          <H2>Who your information goes to</H2>
          <P>
            I use a small number of service providers. They process information
            on my instructions and are not permitted to use it for their own
            purposes:
          </P>
          {/* Scrolls rather than squashing the two columns on a narrow phone. */}
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[26rem] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-line">
                  <th
                    scope="col"
                    className="py-3 pr-6 text-[11px] font-medium tracking-[0.14em] text-white/40 uppercase"
                  >
                    Provider
                  </th>
                  <th
                    scope="col"
                    className="py-3 text-[11px] font-medium tracking-[0.14em] text-white/40 uppercase"
                  >
                    What it handles
                  </th>
                </tr>
              </thead>
              <tbody>
                {processors.map((processor) => (
                  <tr key={processor.name} className="border-b border-line">
                    <th
                      scope="row"
                      className="py-3 pr-6 align-top font-medium whitespace-nowrap text-white"
                    >
                      {processor.name}
                    </th>
                    <td className="py-3 align-top text-white/55">
                      {processor.handles}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <P>
            I do not sell your information, share it with advertisers, or pass it
            to anyone else. There is one exception: if I’m legally required to
            disclose something, I will.
          </P>

          <H2>Transfers outside the EU/EEA</H2>
          <P>
            Some of these providers are based in the United States or process
            data there. Where that happens, transfers are made under the
            safeguards permitted by GDPR, such as standard contractual clauses or an
            adequacy decision, depending on the provider. You can ask me for
            details of the safeguards that apply to any specific provider.
          </P>

          <H2>How long I keep it</H2>
          <List>
            <li>
              Form submissions and email correspondence: up to 24 months from our
              last contact, then deleted. If you become a client, records
              connected to that engagement are kept as long as I’m required to
              for legal and accounting purposes.
            </li>
            <li>
              Booking records: held by Cal.com under their retention policy, and
              in my calendar and inbox under the timeframe above.
            </li>
            <li>
              Video analytics: held by Wistia under their retention policy. I
              only ever see aggregate figures.
            </li>
            <li>Server logs: short-term, under Vercel’s standard retention.</li>
          </List>
          <P>You can ask me to delete your information sooner. See below.</P>

          <H2>Cookies</H2>
          <P>
            This site does not use advertising or cross-site tracking cookies.
          </P>
          <P>
            The cookies that are set come from the embedded Wistia video player
            and are used to remember playback preferences and measure engagement.
            If you’d rather not have them, you can block cookies in your browser
            settings. The site and the videos will still work.
          </P>

          <H2>Your rights</H2>
          <P>Under the GDPR you have the right to:</P>
          <List>
            {dataRights.map((right) => (
              <li key={right}>{right}</li>
            ))}
          </List>
          <P>
            To exercise any of these, email <Mail />. I’ll respond within one
            month. There’s no charge and you don’t need to give a reason.
          </P>
          <P>
            If you’re unhappy with how I’ve handled your information, you can
            complain to the Irish Data Protection Commission at{" "}
            <A href="https://www.dataprotection.ie">dataprotection.ie</A>, or to
            the supervisory authority in your own country.
          </P>

          <H2>Security</H2>
          <P>
            Form submissions are transmitted over HTTPS and delivered to a single
            mailbox that only I have access to, protected by multi-factor
            authentication. Access to the underlying database and hosting
            accounts is restricted to me. I keep the amount of information I
            collect deliberately small, because the safest data is the data that
            was never collected.
          </P>

          <H2>Children</H2>
          <P>
            This site is aimed at businesses. I don’t knowingly collect
            information from anyone under 18.
          </P>

          <H2>Changes to this policy</H2>
          <P>
            If this policy changes, the updated version will be posted here with
            a new date at the top. If the change is significant and affects
            information I already hold about you, I’ll tell you directly.
          </P>

          <H2>Contact</H2>
          <P>
            {legal.businessName}
            <br />
            {legal.address}, Ireland
            <br />
            <Mail />
          </P>
        </article>
      </main>
    </>
  );
}

/* ---------- Local typography: one place per element, so the long document
   below stays readable as prose rather than as a wall of class strings. ---- */

function H2({ children }: { children: ReactNode }) {
  return (
    <h2 className="font-brand mt-14 text-xl font-semibold tracking-[-0.01em] text-white sm:text-2xl">
      {children}
    </h2>
  );
}

function H3({ children }: { children: ReactNode }) {
  return (
    <h3 className="mt-8 text-base font-medium tracking-[-0.01em] text-white">
      {children}
    </h3>
  );
}

function P({
  children,
  className = "mt-4",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p className={`${className} text-sm leading-relaxed text-white/55 sm:text-base`}>
      {children}
    </p>
  );
}

/** The lawful-basis line that closes each collection section. */
function Basis({ children }: { children: ReactNode }) {
  return (
    <P>
      <span className="text-white/75">Lawful basis:</span> {children}
    </P>
  );
}

/*
  Fixed rather than sticky, so it holds its place through the whole policy
  instead of only from wherever its parent happens to start. The blurred pill
  keeps it readable once body text scrolls underneath it, which it will on
  narrow screens where there is no margin to sit in.
*/
function BackArrow() {
  return (
    <Link
      href="/"
      aria-label="Back to home"
      className="fixed top-4 left-4 z-30 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-background/70 text-white backdrop-blur transition hover:border-white/40 hover:bg-white/10 sm:top-6 sm:left-6"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
        className="h-6 w-6"
      >
        <path d="M15 5l-7 7 7 7" />
      </svg>
    </Link>
  );
}

function List({ children }: { children: ReactNode }) {
  return (
    <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-white/55 marker:text-white/25 sm:text-base">
      {children}
    </ul>
  );
}

function A({ href, children }: { href: string; children: ReactNode }) {
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      className="text-white underline underline-offset-4 transition hover:text-white/70"
    >
      {children}
    </a>
  );
}

function Mail() {
  return <A href={`mailto:${legal.email}`}>{legal.email}</A>;
}
