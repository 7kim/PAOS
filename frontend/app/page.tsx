import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { FeatureBand } from "@/components/landing/FeatureBand";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <Hero />
      <HowItWorks />
      <FeatureBand />

      {/* CTA Band */}
      <section className="bg-canvas text-ink">
        <div className="max-w-[1280px] mx-auto px-8 py-20 text-center">
          <p className="font-mono text-[11px] font-medium uppercase tracking-[0.55px] text-body mb-4">
            Get started
          </p>
          <h2 className="font-sans text-[40px] font-medium leading-[48px] tracking-[-0.8px] mb-4">
            Ready to build your next app?
          </h2>
          <p className="font-sans text-[18px] leading-[23.4px] tracking-[-0.18px] text-body/80 mb-8 max-w-[480px] mx-auto">
            Request early access and start generating production-grade SRS
            documents for your projects.
          </p>
          <Link href="/auth/signup">
            <Button variant="primary" size="lg">
              Request early access
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer wordmark */}
      <footer className="bg-canvas text-ink">
        <div className="max-w-[1280px] mx-auto px-8 py-16">
          <p className="font-sans text-[64px] font-medium leading-[70.4px] tracking-[-1.92px] text-hairline/20 text-center select-none">
            code-srs
          </p>
          <p className="font-mono text-[11px] font-medium uppercase tracking-[0.55px] text-body text-center mt-8">
            Powered by PAOS — Personal Agent Operating System
          </p>
        </div>
      </footer>
    </>
  );
}
