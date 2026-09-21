import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { site } from "@/lib/site";

/*
  Section links are absolute ("/#faq") rather than bare hashes so they work
  from /privacy as well as the home page. A bare "#faq" on /privacy would only
  rewrite the URL and scroll nowhere.
*/
const sections = [
  { label: "What I check", href: "/#patterns" },
  { label: "The service", href: "/#service" },
  { label: "FAQ", href: "/#faq" },
  { label: "See if you’re a fit", href: "/#book" },
] as const;

export function SiteFooter() {
  return (
    <footer className="w-full border-t border-line px-6 py-14 sm:py-16">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-8 text-center">
        <Link href="/#top" aria-label={site.name} className="shrink-0">
          <Image
            src="/agencyappsec-logo.png"
            alt={site.name}
            width={558}
            height={118}
            className="h-9 w-auto opacity-80 transition hover:opacity-100"
          />
        </Link>

        <Row aria-label="Sections">
          {sections.map((section, i) => (
            <Item key={section.href} first={i === 0}>
              <FooterLink href={section.href}>{section.label}</FooterLink>
            </Item>
          ))}
        </Row>

        <Row aria-label="Contact and legal">
          <Item first>
            <FooterLink href={`mailto:${site.email}`}>{site.email}</FooterLink>
          </Item>
          <Item>
            {/* Plain text until a portfolio URL exists. See site.portfolio. */}
            {site.portfolio ? (
              <FooterLink href={site.portfolio} external>
                About me
              </FooterLink>
            ) : (
              <span className="text-white/45">About me</span>
            )}
          </Item>
          <Item>
            <FooterLink href="/privacy">Privacy policy</FooterLink>
          </Item>
        </Row>

        <p className="max-w-md text-sm leading-relaxed text-balance text-white/40">
          Every engagement begins with written authorization. No system is ever
          tested without it.
        </p>
      </div>
    </footer>
  );
}

function Row({
  children,
  "aria-label": label,
}: {
  children: ReactNode;
  "aria-label": string;
}) {
  return (
    <nav aria-label={label}>
      <ul className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm">
        {children}
      </ul>
    </nav>
  );
}

/*
  The separator is a sibling of the link rather than a border or a gap, so it
  wraps with the row on narrow screens instead of stranding a dot at the end of
  a line. aria-hidden keeps it out of the screen reader's way.
*/
function Item({
  children,
  first = false,
}: {
  children: ReactNode;
  first?: boolean;
}) {
  return (
    <li className="flex items-center gap-3">
      {!first && (
        <span aria-hidden className="text-white/20">
          ·
        </span>
      )}
      {children}
    </li>
  );
}

function FooterLink({
  href,
  children,
  external = false,
}: {
  href: string;
  children: ReactNode;
  external?: boolean;
}) {
  return (
    <Link
      href={href}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      className="text-white/45 transition hover:text-white"
    >
      {children}
    </Link>
  );
}
