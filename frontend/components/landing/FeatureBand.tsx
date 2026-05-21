import { Brain, Shield, Zap, GitBranch } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI-Native SRS",
    description:
      "Full system-analysis-and-design pipeline generates complete, production-grade System Requirements Specifications.",
  },
  {
    icon: Shield,
    title: "Enterprise-Grade",
    description:
      "H-Factor governance enforces separation of powers, audit immutability, and identity-first execution.",
  },
  {
    icon: Zap,
    title: "Multi-Model",
    description:
      "Choose from Nova, Atlas, Apex, Spark, or Cortex — each optimized for different reasoning profiles.",
  },
  {
    icon: GitBranch,
    title: "Pipeline-Driven",
    description:
      "From plan to review to execution, every step is artifact-driven with full traceability.",
  },
];

export function FeatureBand() {
  return (
    <section id="features" className="bg-canvas-dark text-on-dark">
      <div className="max-w-[1280px] mx-auto px-8 py-20">
        {/* Eyebrow */}
        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.55px] text-brand-periwinkle text-center mb-4">
          Features
        </p>

        <h2 className="font-sans text-[40px] font-medium leading-[48px] tracking-[-0.8px] text-center mb-16">
          Everything you need to build better specs
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-[4px] border border-surface-dark-soft bg-canvas-dark p-6"
            >
              <div className="w-10 h-10 rounded-[4px] bg-surface-dark-soft flex items-center justify-center mb-4">
                <feature.icon className="w-5 h-5 text-brand-periwinkle" />
              </div>
              <h3 className="font-sans text-[22px] font-medium leading-[25.3px] tracking-[-0.22px] mb-2">
                {feature.title}
              </h3>
              <p className="font-sans text-[16px] leading-[20.8px] text-on-dark/60">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
