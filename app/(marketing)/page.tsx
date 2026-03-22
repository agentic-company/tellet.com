import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { SocialProof } from "@/components/sections/SocialProof";
import { TerminalDemo } from "@/components/sections/TerminalDemo";
import { Features } from "@/components/sections/Features";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Compare } from "@/components/sections/Compare";
import { GetStarted } from "@/components/sections/GetStarted";
import { FinalCTA } from "@/components/sections/FinalCTA";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <SocialProof />
        <TerminalDemo />
        <Features />
        <HowItWorks />
        <Compare />
        <GetStarted />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
