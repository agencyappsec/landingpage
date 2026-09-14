import {
  hasProfile,
  testimonials,
  testimonialsLabel,
  type Testimonial,
} from "@/lib/testimonials";

/**
 * The proof strip under the hero: a row of quote cards sliding past forever.
 *
 * No "use client" and no state — the movement is one CSS animation, so this
 * ships as a Server Component with zero JavaScript. A JS-driven marquee would
 * cost a hydration boundary for something the compositor does on its own.
 *
 * The list is rendered twice. The track slides exactly -50%, which lands the
 * second copy precisely where the first began, so the loop has no seam. That
 * only holds if each half is exactly half the track: hence a right *margin* on
 * every card rather than a flex `gap`. A gap is only applied *between* items,
 * so with one gap missing at the end the two halves differ by half a gap and
 * the strip visibly jumps once per lap.
 */
export function Testimonials() {
  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-label"
      className="w-full pt-8 pb-5 sm:pt-10 sm:pb-7"
    >
      <SheenGradient />

      <p
        id="testimonials-label"
        className="text-center text-[11px] font-medium tracking-[0.22em] text-white/35 uppercase"
      >
        {testimonialsLabel}
      </p>

      {/*
        Full-bleed on purpose — the cards run off both edges to read as an
        endless line rather than a row of six that happens to fit. The mask on
        .marquee fades them out at the edges instead of cutting them dead.
      */}
      <div className="marquee mt-7">
        <ul className="marquee-track">
          {testimonials.map((t) => (
            <Card key={t.handle} testimonial={t} />
          ))}
          {/*
            The seam copy: the same six cards again, so the loop closes without
            a gap. Hidden from assistive tech and kept out of the tab order so
            the quotes aren't announced or tabbed through twice.
          */}
          {testimonials.map((t) => (
            <Card key={`${t.handle}-copy`} testimonial={t} duplicate />
          ))}
        </ul>
      </div>
    </section>
  );
}

function Card({
  testimonial,
  duplicate = false,
}: {
  testimonial: Testimonial;
  /** The seam copy: same pixels, but not a second entry in the tab order. */
  duplicate?: boolean;
}) {
  const { name, handle, linkedin, quote } = testimonial;
  return (
    <li
      className="metal-edge mr-4 flex w-[19rem] shrink-0 flex-col rounded-2xl p-5 transition hover:[--metal-fill:#101013]"
      aria-hidden={duplicate || undefined}
    >
      <div className="flex items-start gap-3">
        <Monogram name={name} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-white">{name}</p>
          <p className="truncate text-xs text-white/40">@{handle}</p>
        </div>
      </div>

      <blockquote className="mt-4 line-clamp-3 text-sm leading-relaxed text-white/55">
        &ldquo;{quote}&rdquo;
      </blockquote>

      {/*
        mt-auto rather than a fixed margin, and absolute positioning rather
        than neither: flex row items stretch, so every card is as tall as the
        tallest quote, and a short quote would otherwise leave its mark floating
        mid-card. mt-auto pushes it to the floor of whichever card it's in.
        Absolute would have worked too, but would sit over the last line of a
        three-line quote instead of below it.
      */}
      <div className="mt-auto flex justify-end pt-4">
        <Profile name={name} url={linkedin} duplicate={duplicate} />
      </div>
    </li>
  );
}

/**
 * Initials on a tinted disc, rather than a photo.
 *
 * A stock headshot next to a real name is a face that belongs to someone who
 * never said this, so there is no photo to get wrong. The hue is derived from
 * the name so each person keeps their own colour, and derived rather than
 * random so the server and client agree — Math.random() here would be a
 * hydration mismatch on every load.
 */
function Monogram({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  let hash = 0;
  for (const char of name) hash = (hash * 31 + char.charCodeAt(0)) % 360;

  return (
    <span
      aria-hidden
      className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-xs font-semibold text-white/90"
      style={{
        background: `linear-gradient(140deg, hsl(${hash} 45% 38%), hsl(${
          (hash + 45) % 360
        } 45% 22%))`,
      }}
    >
      {initials}
    </span>
  );
}

/**
 * The LinkedIn mark, linked to the person's profile.
 *
 * Until a real URL replaces the placeholder it renders as a plain mark rather
 * than a link: a testimonial whose name leads to a 404 reads as invented, so
 * an inert logo is the better failure. The card itself is deliberately not the
 * link — the strip is a marquee, and a card-sized target sliding under the
 * cursor is easy to click by accident.
 */
function Profile({
  name,
  url,
  duplicate,
}: {
  name: string;
  url: string;
  duplicate: boolean;
}) {
  if (!hasProfile(url)) {
    return (
      <span className="shrink-0 opacity-55">
        <LinkedInMark />
      </span>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      /*
       * aria-hidden on the seam copy hides it from a screen reader but leaves
       * it focusable, which would put every profile in the tab order twice and
       * send focus into cards that exist only to close the loop.
       */
      tabIndex={duplicate ? -1 : undefined}
      /* noreferrer as well as noopener: the target shouldn't be told which
         page sent them, and older browsers only honour the pair. */
      rel="noopener noreferrer"
      aria-label={`${name} on LinkedIn (opens in a new tab)`}
      className="shrink-0 opacity-65 transition hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none"
    >
      <LinkedInMark />
    </a>
  );
}

function LinkedInMark() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="url(#linkedin-sheen)"
      aria-hidden
      className="h-4 w-4 shrink-0"
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
    </svg>
  );
}

/**
 * The sheen the LinkedIn marks are filled with.
 *
 * Rendered once for the whole strip: an SVG gradient is referenced by id, and
 * twelve copies of one id is a document full of duplicate ids where only the
 * first would ever be used. The stops run bright, dim, bright rather than
 * light to dark, so the mark catches the light the way .metal-edge does on the
 * cards around it instead of just looking like a lighter grey.
 */
function SheenGradient() {
  return (
    <svg aria-hidden className="absolute h-0 w-0" focusable="false">
      <defs>
        <linearGradient id="linkedin-sheen" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="38%" stopColor="#c8ccd2" />
          <stop offset="62%" stopColor="#8f949b" />
          <stop offset="100%" stopColor="#f2f4f6" />
        </linearGradient>
      </defs>
    </svg>
  );
}
