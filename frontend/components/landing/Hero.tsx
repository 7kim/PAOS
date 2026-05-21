import { Button } from "@/components/ui/Button";
import Link from "next/link";

export function Hero() {
  return (
    <section className="bg-canvas-dark text-on-dark">
      <div className="max-w-[1280px] mx-auto px-8 pt-32 pb-20">
        {/* Eyebrow */}
        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.55px] text-brand-periwinkle mb-6">
          Code-SRS — Powered by PAOS
        </p>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left: Headline + CTA */}
          <div>
            <h1 className="font-sans text-[64px] md:text-[64px] font-medium leading-[70.4px] tracking-[-1.92px] text-on-dark mb-6">
              Describe your app.
              <br />
              <span className="bg-gradient-to-r from-brand-orange via-brand-magenta to-brand-periwinkle bg-clip-text text-transparent">
                We build the spec.
              </span>
            </h1>

            <p className="font-sans text-[18px] leading-[23.4px] tracking-[-0.18px] text-on-dark/70 mb-10 max-w-[480px]">
              AI-native SRS generation end-to-end. Describe your app idea, and
              our PAOS pipeline forces system-analysis-and-design, then helps
              you test, build, and deploy.
            </p>

            <div className="flex items-center gap-3">
              <Link href="/auth/signup">
                <Button variant="gradient" size="lg">
                  Start building →
                </Button>
              </Link>
              <a href="#how-it-works">
                <Button variant="ghost" size="lg">
                  How it works
                </Button>
              </a>
            </div>
          </div>

          {/* Right: Gradient ribbon / decorative element */}
          <div className="hidden md:flex items-center justify-center">
            <div className="w-full h-[400px] rounded-[4px] bg-gradient-to-br from-brand-orange via-brand-magenta to-brand-periwinkle opacity-80" />
          </div>
        </div>
      </div>
    </section>
  );
}
