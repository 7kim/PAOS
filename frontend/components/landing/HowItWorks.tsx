import { Lightbulb, FileText, Rocket } from "lucide-react";

const steps = [
  {
    icon: Lightbulb,
    title: "Describe your idea",
    description:
      "Tell us about the app you want to build in plain language. Our AI parses your requirements and structures them.",
  },
  {
    icon: FileText,
    title: "SRS generated & reviewed",
    description:
      "PAOS forces system-analysis-and-design end-to-end, producing a complete System Requirements Specification.",
  },
  {
    icon: Rocket,
    title: "Built & deployed",
    description:
      "From spec to code — we help you build, test, and deploy your application with AI-assisted development.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-canvas text-ink">
      <div className="max-w-[1280px] mx-auto px-8 py-20">
        {/* Eyebrow */}
        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.55px] text-body text-center mb-4">
          How it works
        </p>

        <h2 className="font-sans text-[40px] font-medium leading-[48px] tracking-[-0.8px] text-center mb-16">
          From idea to specification in minutes
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={step.title} className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-[4px] bg-black text-white mb-6">
                <step.icon className="w-8 h-8" />
              </div>
              <p className="font-mono text-[11px] font-medium uppercase tracking-[0.55px] text-body mb-2">
                Step {index + 1}
              </p>
              <h3 className="font-sans text-[22px] font-medium leading-[25.3px] tracking-[-0.22px] mb-3">
                {step.title}
              </h3>
              <p className="font-sans text-[16px] leading-[20.8px] text-body/80 max-w-[320px] mx-auto">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
