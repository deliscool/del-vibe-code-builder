import { CheckCircle2, AlertCircle, ExternalLink } from "lucide-react";
import PhaseWrapper from "../PhaseWrapper";
import ExportBlock from "../ExportBlock";
import type { BriefData } from "./BriefPhase";
import type { ResearchData } from "./ResearchPhase";
import type { PersonaData } from "./PersonaPhase";
import type { RoadmapData } from "./RoadmapPhase";

interface SummaryPhaseProps {
  brief: BriefData;
  research: ResearchData;
  persona: PersonaData | null;
  roadmap: RoadmapData | null;
  onGoToPhase: (phase: number) => void;
}

const SummaryPhase = ({ brief, research, persona, roadmap, onGoToPhase }: SummaryPhaseProps) => {
  const briefFilled = Object.values(brief).filter((v) => v.trim()).length;
  const briefTotal = Object.keys(brief).length;
  const researchFilled = Object.values(research).filter((v) => v.trim()).length;
  const researchTotal = Object.keys(research).length;
  const hasPersona = persona !== null;
  const hasResearch = Object.values(research).some((v) => v.trim());
  const hasBrief = Object.values(brief).some((v) => v.trim());
  const hasRoadmap = roadmap !== null;
  const totalStories = roadmap ? roadmap.mustHave.length + roadmap.shouldHave.length + roadmap.couldHave.length : 0;

  const sections = [
    {
      label: "Product Brief",
      phase: 1,
      complete: briefFilled >= 3,
      detail: `${briefFilled}/${briefTotal} fields completed`,
      preview: brief.summary ? brief.summary.slice(0, 120) + (brief.summary.length > 120 ? "…" : "") : null,
    },
    {
      label: "Market Research",
      phase: 2,
      complete: researchFilled >= 3,
      detail: `${researchFilled}/${researchTotal} questions answered`,
      preview: research.name || null,
    },
    {
      label: "Persona",
      phase: 3,
      complete: hasPersona,
      detail: hasPersona ? `${persona!.displayName} — ${persona!.roleInfo}` : "Not generated yet",
      preview: hasPersona ? `Goal: ${persona!.goal.slice(0, 100)}` : null,
    },
    {
      label: "Empathy Map",
      phase: 4,
      complete: hasResearch,
      detail: hasResearch ? "6 quadrants generated" : "Needs research data",
      preview: research.frustrations ? `Pains: ${research.frustrations.slice(0, 80)}` : null,
    },
    {
      label: "Journey Map",
      phase: 5,
      complete: hasResearch || hasBrief,
      detail: hasResearch || hasBrief ? "5 lanes × 4 phases generated" : "Needs brief or research data",
      preview: null,
    },
    {
      label: "Product Roadmap",
      phase: 6,
      complete: hasRoadmap,
      detail: hasRoadmap ? `${totalStories} user stories across 3 priorities` : "Not generated yet",
      preview: hasRoadmap && roadmap!.mustHave.length > 0 ? `MVP: ${roadmap!.mustHave[0].slice(0, 80)}…` : null,
    },
  ];

  const completedCount = sections.filter((s) => s.complete).length;

  return (
    <PhaseWrapper title="Summary & Export" subtitle="Review all sections before exporting your product requirements document.">
      {/* Progress overview */}
      <div className="mb-8 rounded-xl border-2 border-primary/20 bg-primary/5 p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-heading font-bold text-primary text-lg">Completion Progress</h3>
          <span className="text-sm font-semibold text-primary">{completedCount}/{sections.length} sections</span>
        </div>
        <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${(completedCount / sections.length) * 100}%` }}
          />
        </div>
        {completedCount === sections.length && (
          <p className="text-sm text-primary mt-3 font-medium">🎉 All sections complete — your document is ready to export!</p>
        )}
      </div>

      {/* Section cards */}
      <div className="space-y-4 mb-10">
        {sections.map((s) => (
          <div
            key={s.label}
            className={`rounded-xl border p-5 transition ${
              s.complete ? "border-primary/20 bg-card" : "border-border bg-muted/30"
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                {s.complete ? (
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
                )}
                <div className="min-w-0">
                  <h4 className="font-heading font-bold text-foreground text-sm">{s.label}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">{s.detail}</p>
                  {s.preview && (
                    <p className="text-xs text-foreground/60 mt-2 italic truncate">{s.preview}</p>
                  )}
                </div>
              </div>
              <button
                onClick={() => onGoToPhase(s.phase)}
                className="text-xs px-3 py-1.5 rounded-lg border border-border text-muted-foreground hover:bg-muted transition shrink-0"
              >
                {s.complete ? "Edit" : "Complete"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Export block */}
      <ExportBlock brief={brief} research={research} persona={persona} roadmap={roadmap} />

      {/* Final CTA */}
      <div className="mt-10 text-center">
        <a
          href="https://claude.ai"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-gold text-accent-foreground font-heading font-bold text-lg shadow-lg hover:brightness-110 transition"
        >
          Build with Claude <ExternalLink className="w-5 h-5" />
        </a>
        <p className="text-sm text-muted-foreground mt-3">
          Copy your export above, then paste it into Claude to start building your prototype.
        </p>
      </div>
    </PhaseWrapper>
  );
};

export default SummaryPhase;
