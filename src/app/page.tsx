import { Audience } from "@/components/audience";
import { Checks } from "@/components/checks";
import { Faq } from "@/components/faq";
import { Fit } from "@/components/fit";
import { Hero } from "@/components/hero";
import { Service } from "@/components/service";

export default function Home() {
  return (
    <main className="flex-1">
      <Hero />
      <Checks />
      <Service />
      <Audience />
      <Fit />
      <Faq />
    </main>
  );
}
