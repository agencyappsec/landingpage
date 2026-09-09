import Image from "next/image";
import Link from "next/link";

import { site } from "@/lib/site";

type SiteNavProps = {
  /** Where the wordmark goes. The home page scrolls; other routes go home. */
  href?: string;
};

export function SiteNav({ href = "#top" }: SiteNavProps) {
  return (
    <header className="relative z-20 flex justify-center px-6 pt-6">
      <nav className="flex items-center">
        <Link href={href} aria-label={site.name} className="shrink-0">
          <Image
            src="/agencyappsec-logo.png"
            alt={site.name}
            width={558}
            height={118}
            priority
            className="h-10 w-auto sm:h-12"
          />
        </Link>
      </nav>
    </header>
  );
}
