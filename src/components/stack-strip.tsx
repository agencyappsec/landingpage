import { stackLogos } from "@/lib/stack-logos";

export function StackStrip() {
  return (
    <div className="relative z-10 mt-8 w-full px-6 pb-8">
      <p className="text-center text-[11px] font-medium tracking-[0.22em] text-white/35 uppercase">
        The stack I specialize in
      </p>
      <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-6 sm:gap-x-14">
        {stackLogos.map((logo) => (
          <li key={logo.name} className="flex items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logo.src}
              alt={logo.name}
              width={logo.width}
              height={logo.height}
              className="w-auto opacity-80 transition hover:opacity-100"
              style={{ height: logo.height }}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
