import { Carousel } from "@/components/carousel";
import { audienceSignals } from "@/lib/audience";

/**
 * The signals, one at a time, in a single box.
 *
 * Reading all five at once made them a checklist to skim. One at a time makes
 * each its own claim, and asks for a small decision before the next arrives.
 */
export function AudienceCarousel() {
  return (
    <Carousel
      label="Signals that this is for you"
      itemName="signal"
      /*
        Deliberately narrower than the section around it. A 3xl-wide box put
        the longest signal on two lines and left the short ones sitting in a
        lot of empty width; at this width they run to about four lines each, so
        the box reads as a statement rather than a stray sentence.
      */
      boxClassName="mx-auto w-full max-w-sm px-6 py-9 sm:px-8 sm:py-11"
      slides={audienceSignals.map((signal) => ({
        key: signal,
        content: (
          <p className="text-center text-base leading-relaxed text-white/70 sm:text-lg">
            {signal}
          </p>
        ),
      }))}
    />
  );
}
