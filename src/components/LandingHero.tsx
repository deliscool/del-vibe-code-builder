import { ArrowRight, BookOpen, Users, Map, FileText, Sparkles } from "lucide-react";

interface LandingHeroProps {
  onStart: () => void;
}

const steps = [
  { icon: BookOpen, label: "Learn", desc: "10-slide vibe coding tutorial from Dan Olsen's framework" },
  { icon: FileText, label: "Brief", desc: "Capture your product idea with a structured brief template" },
  { icon: Users, label: "Research", desc: "Build persona, empathy map & journey map from user research" },
  { icon: Map, label: "Roadmap", desc: "Auto-generate prioritized user stories (MoSCoW)" },
  { icon: Sparkles, label: "Export", desc: "Copy or download your full PRD — paste into any AI coding tool" },
];

const LandingHero = ({ onStart }: LandingHeroProps) => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="w-full bg-primary py-4 px-6">
        <span className="font-heading font-bold text-gold text-xl">Del VibeCode Guide</span>
      </header>

      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16 max-w-3xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 border border-gold/20 text-sm text-accent-foreground font-medium mb-6">
          <Sparkles className="w-4 h-4" />
          Free &amp; Open — No login required
        </div>

        <h1 className="text-4xl sm:text-5xl font-heading font-bold text-primary leading-tight mb-4">
          Turn your product idea into an AI-ready requirements doc
        </h1>

        <p className="text-lg text-muted-foreground max-w-2xl mb-10 leading-relaxed">
          Del VibeCode Guide walks you through product strategy — from brief to persona to roadmap — then
          exports everything as a single document you can paste into Claude, Cursor, or any AI coding tool
          to start building immediately.
        </p>

        <button
          onClick={onStart}
          className="flex items-center gap-3 px-10 py-4 rounded-xl bg-gold text-accent-foreground font-heading font-bold text-lg shadow-lg hover:brightness-110 transition"
        >
          Start Building <ArrowRight className="w-5 h-5" />
        </button>

        <p className="text-sm text-muted-foreground mt-4">
          Takes about 15 minutes · Everything saves automatically
        </p>
      </div>

      {/* How it works */}
      <div className="bg-card border-t border-border py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-heading font-bold text-primary text-center mb-10">How It Works</h2>
          <div className="space-y-6">
            {steps.map((step, i) => (
              <div key={step.label} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shrink-0 shadow-sm">
                  <step.icon className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-muted-foreground">Step {i + 1}</span>
                    <h3 className="font-heading font-bold text-foreground">{step.label}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="py-12 px-6 text-center">
        <button
          onClick={onStart}
          className="inline-flex items-center gap-3 px-10 py-4 rounded-xl bg-gold text-accent-foreground font-heading font-bold text-lg shadow-lg hover:brightness-110 transition"
        >
          Get Started <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default LandingHero;
