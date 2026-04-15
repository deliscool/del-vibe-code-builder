import { ChevronLeft, ChevronRight } from "lucide-react";
import PhaseWrapper from "../PhaseWrapper";

const slides = [
  {
    title: "What is Vibe Coding?",
    content: "Vibe coding is a new way to build software by describing what you want in plain language — and letting AI write the code. You don't need to know how to program. You just need to know what to build and why.",
    tip: "Think of it like directing a movie: you set the vision, the AI handles the technical execution."
  },
  {
    title: "The Tool Spectrum",
    content: "AI coding tools range from no-code (Bolt, Lovable) to low-code (Cursor, Replit) to full-code (Claude Code, GitHub Copilot). The less technical you are, the more you want a tool that handles the setup for you.",
    tip: "Start with Bolt or Lovable — they run in your browser with zero setup."
  },
  {
    title: "Product-Market Fit Pyramid",
    content: "Dan Olsen's pyramid has five layers: target customer → underserved needs → value proposition → feature set → UX. You build from the bottom up. Vibe coding lets you test the top layers (features, UX) much faster.",
    tip: "Don't skip the bottom layers. A beautiful prototype of the wrong product is still wrong."
  },
  {
    title: "The Lean Product Process",
    content: "Olsen's 6-step process: (1) Determine target customer, (2) Identify underserved needs, (3) Define value proposition, (4) Specify MVP feature set, (5) Create MVP prototype, (6) Test with customers. This app follows steps 1–5.",
    tip: "Vibe coding collapses steps 4 and 5 — you go from user stories to a working prototype in minutes."
  },
  {
    title: "The Product Brief",
    content: "A product brief is the single document that captures everything the AI needs to build your prototype: who the user is, what problems they have, what features to build, and how it should look and feel.",
    tip: "The better your brief, the better the AI output. Garbage in, garbage out — even with AI."
  },
  {
    title: "UX Research Tools",
    content: "Personas, empathy maps, and journey maps aren't just academic exercises — they're prompt fuel. Each one gives the AI richer context about your user, which means more relevant, more usable prototypes.",
    tip: "This app will auto-generate these artifacts from your research answers. No design skills needed."
  },
  {
    title: "Four Prototype Audiences",
    content: "Your prototype serves four audiences: (1) Yourself — to clarify thinking, (2) Your team — to align on vision, (3) Users — to validate assumptions, (4) Stakeholders — to secure buy-in. Design your prototype with all four in mind.",
    tip: "You're ready! Let's build your product brief, research your user, and generate your prototype artifacts."
  },
];

interface TutorialPhaseProps {
  currentSlide: number;
  onSlideChange: (slide: number) => void;
  onComplete: () => void;
}

const TutorialPhase = ({ currentSlide, onSlideChange, onComplete }: TutorialPhaseProps) => {
  const slide = slides[currentSlide];
  const isLast = currentSlide === slides.length - 1;

  return (
    <PhaseWrapper title="Learn Vibe Coding" subtitle="7 key concepts to get you started">
      {/* Progress bar */}
      <div className="w-full h-2 bg-muted rounded-full mb-8 overflow-hidden">
        <div
          className="h-full bg-gold rounded-full transition-all duration-500"
          style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
        />
      </div>

      <div className="bg-card rounded-xl border border-border p-8 shadow-sm animate-fade-in" key={currentSlide}>
        <span className="text-label text-muted-foreground">
          Slide {currentSlide + 1} of {slides.length}
        </span>
        <h2 className="text-section font-heading font-bold text-primary mt-2 mb-4">
          {slide.title}
        </h2>
        <p className="text-body text-foreground mb-6 leading-relaxed">{slide.content}</p>
        <div className="bg-gold/10 border border-gold/20 rounded-lg p-4">
          <p className="text-sm text-foreground">
            <span className="font-semibold text-gold-dark">💡 Tip:</span> {slide.tip}
          </p>
        </div>
      </div>

      <div className="flex justify-between mt-6">
        <button
          onClick={() => onSlideChange(currentSlide - 1)}
          disabled={currentSlide === 0}
          className="flex items-center gap-1 px-4 py-2 rounded-lg border border-border text-muted-foreground hover:bg-muted transition disabled:opacity-30"
        >
          <ChevronLeft className="w-4 h-4" /> Previous
        </button>
        {isLast ? (
          <button
            onClick={onComplete}
            className="px-6 py-2 rounded-lg bg-gold text-accent-foreground font-semibold shadow-md hover:brightness-110 transition"
          >
            Start Building →
          </button>
        ) : (
          <button
            onClick={() => onSlideChange(currentSlide + 1)}
            className="flex items-center gap-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-purple-light transition"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </PhaseWrapper>
  );
};

export default TutorialPhase;
