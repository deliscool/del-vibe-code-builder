import { ChevronLeft, ChevronRight } from "lucide-react";
import PhaseWrapper from "../PhaseWrapper";

import slideOrigin from "@/assets/slides/slide-origin.jpg";
import slideSpectrum from "@/assets/slides/slide-spectrum.jpg";
import slideMeme from "@/assets/slides/slide-meme.jpg";
import slidePmfPyramid from "@/assets/slides/slide-pmf-pyramid.jpg";
import slideLeanProcess from "@/assets/slides/slide-lean-process.jpg";
import slideProductCreator from "@/assets/slides/slide-product-creator.jpg";
import slideVibeWorkflow from "@/assets/slides/slide-vibe-workflow.jpg";
import slideIteration from "@/assets/slides/slide-iteration.jpg";
import slideBrief from "@/assets/slides/slide-brief.jpg";
import slideAudiences from "@/assets/slides/slide-audiences.jpg";

const slides = [
  {
    title: "What is Vibe Coding?",
    content: "The term \"vibe coding\" was coined by Andrej Karpathy on February 2, 2025. He described it as: \"a new kind of coding where you fully give in to the vibes, embrace exponentials, and forget that the code even exists.\" You describe what you want in plain language — and AI writes the code. You don't need to know how to program.",
    tip: "Karpathy's post got 5M views. Vibe coding is only months old — you're getting in early.",
    source: "Andrej Karpathy, Feb 2025",
    image: slideOrigin,
    imageAlt: "Andrej Karpathy's original tweet defining vibe coding"
  },
  {
    title: "The Vibe Coding Spectrum",
    content: "Dan Olsen maps AI coding tools on a spectrum from less technical to more technical. On the left: Vibe Prototyping tools like Magic Patterns, Bolt, Lovable, and Replit. On the right: Vibe Coding tools like Cursor, Windsurf, GitHub Copilot, Claude Code, and Gemini CLI. Designers use the left side; developers the right; PMs can use the full range.",
    tip: "Start with browser-based tools (Bolt, Lovable) — zero setup, instant results. Move right as you gain confidence.",
    source: "Dan Olsen, Vibe Coding Spectrum",
    image: slideSpectrum,
    imageAlt: "Vibe Coding Spectrum chart showing tools from less technical to more technical"
  },
  {
    title: "You Can't Just Vibe Code a Great Product",
    content: "As Dan Olsen puts it: \"One does not simply vibe code a great product.\" The AI can write code fast, but it can't decide what to build or who to build it for. Without product strategy — understanding your customer, their problems, and your value proposition — you'll just build the wrong thing faster.",
    tip: "Speed without direction is just expensive wandering. Strategy first, then vibe code.",
    source: "Dan Olsen, BYU Presentation",
    image: slideMeme,
    imageAlt: "One does not simply vibe code a great product meme"
  },
  {
    title: "The Product-Market Fit Pyramid",
    content: "Dan Olsen's Product-Market Fit Pyramid has five layers you build from the bottom up: (1) Target Customer → (2) Underserved Needs → (3) Value Proposition → (4) Feature Set → (5) UX. The bottom two layers are your Market. The top three are your Product. Product-Market Fit lives at the boundary between them.",
    tip: "Don't skip the bottom layers. A beautiful prototype of the wrong product is still wrong.",
    source: "Dan Olsen, The Lean Product Playbook",
    image: slidePmfPyramid,
    imageAlt: "The Product-Market Fit Pyramid showing 5 layers from Target Customer to UX"
  },
  {
    title: "The Lean Product Process",
    content: "Olsen's 6-step Lean Product Process maps to the pyramid: (1) Determine target customer, (2) Identify underserved needs, (3) Define value proposition, (4) Specify MVP feature set, (5) Create MVP prototype, (6) Test with customers. This app walks you through steps 1–5. Vibe coding collapses steps 4 and 5.",
    tip: "The process is iterative. Insights from testing (step 6) loop back to refine earlier steps.",
    source: "Dan Olsen, The Lean Product Playbook",
    image: slideLeanProcess,
    imageAlt: "The Lean Product Process diagram with 6 steps and iterative feedback loop"
  },
  {
    title: "The Design Gap & Product Creator Role",
    content: "Many teams have a design gap — PM defines, engineering develops, but nobody truly designs the UX. Olsen shows that the overlap between PM, UX, and Dev roles is increasing. Vibe coding creates a new role: the \"Product Creator\" — someone who can define, design, AND build prototypes without waiting for handoffs. That's you.",
    tip: "You don't need to become an engineer. You just need to bridge the gap between idea and prototype.",
    source: "Dan Olsen, BYU Presentation",
    image: slideProductCreator,
    imageAlt: "Venn diagram showing PM, Dev, and UX roles merging into the Product Creator"
  },
  {
    title: "Vibe Prototyping vs. Vibe Building",
    content: "Olsen distinguishes between Vibe Prototyping (using browser-based tools like Bolt and Lovable to quickly test ideas) and Vibe Building (using more technical tools like Cursor and Claude Code for production code). Vibe coding lets you skip straight from ideas to live prototypes — high fidelity AND high interactivity.",
    tip: "Use vibe prototyping to validate ideas fast. Only invest in vibe building after you've confirmed product-market fit.",
    source: "Dan Olsen, BYU Presentation",
    image: slideVibeWorkflow,
    imageAlt: "Vibe Coding Design & Test Workflow showing Live Prototype and Live Product on fidelity vs interactivity axes"
  },
  {
    title: "Iterating Across Problem & Solution Space",
    content: "Great products come from iterating between Problem Space (who's the user, what are their needs?) and Solution Space (what features, what UX?). Your vibe coded output gives you new insights about the problem, which feeds back into better solutions. Personas, empathy maps, and journey maps aren't academic — they're prompt fuel.",
    tip: "This app will auto-generate these artifacts from your research answers. No design skills needed.",
    source: "Dan Olsen, BYU Presentation",
    image: slideIteration,
    imageAlt: "Diagram showing iteration between Problem Space and Solution Space via Vibe Coding Output and New Insights"
  },
  {
    title: "The Product Brief",
    content: "A product brief is the single document that captures everything the AI needs to build your prototype: target customer, customer problems, functional requirements, UX guidance, data model, and tech stack. Dan Olsen recommends keeping it concise — bullet points, not essays. The better your brief, the better the AI output.",
    tip: "Olsen provides a brief template at bit.ly/vibebrief. This app has one built in — you'll fill it out next.",
    source: "Dan Olsen, BYU Presentation",
    image: slideBrief,
    imageAlt: "Good to Use a Product Brief Template slide showing key sections"
  },
  {
    title: "Four Prototype Audiences",
    content: "Your prototype serves four concentric audiences: (1) You — to clarify your own thinking, (2) Your Team — to align on product vision, (3) Stakeholders — to secure buy-in and resources, (4) Customers — to validate assumptions with real users. Design your prototype with all four in mind.",
    tip: "You're ready! Let's build your product brief, research your user, and generate your prototype artifacts.",
    source: "Dan Olsen, BYU Presentation",
    image: slideAudiences,
    imageAlt: "Concentric circles showing four prototype audiences: You, Your Team, Stakeholders, Customers"
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
    <PhaseWrapper title="Learn Vibe Coding" subtitle={`${slides.length} key concepts from Dan Olsen's framework`}>
      {/* Progress bar */}
      <div className="w-full h-2 bg-muted rounded-full mb-8 overflow-hidden">
        <div
          className="h-full bg-gold rounded-full transition-all duration-500"
          style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
        />
      </div>

      <div className="bg-card rounded-xl border border-border shadow-sm animate-fade-in overflow-hidden" key={currentSlide}>
        {/* Slide image */}
        {slide.image && (
          <div className="w-full bg-black/5 border-b border-border">
            <img
              src={slide.image}
              alt={slide.imageAlt}
              className="w-full max-h-[400px] object-contain mx-auto"
              loading="lazy"
            />
          </div>
        )}

        <div className="p-8">
          <span className="text-label text-muted-foreground">
            Slide {currentSlide + 1} of {slides.length}
          </span>
          <h2 className="text-section font-heading font-bold text-primary mt-2 mb-4">
            {slide.title}
          </h2>
          <p className="text-body text-foreground mb-6 leading-relaxed">{slide.content}</p>
          <div className="bg-gold/10 border border-gold/20 rounded-lg p-4 mb-4">
            <p className="text-sm text-foreground">
              <span className="font-semibold text-gold-dark">💡 Tip:</span> {slide.tip}
            </p>
          </div>
          {slide.source && (
            <p className="text-xs text-muted-foreground italic">
              — {slide.source}
            </p>
          )}
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
