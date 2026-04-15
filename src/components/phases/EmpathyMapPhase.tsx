import { RefreshCw } from "lucide-react";
import PhaseWrapper from "../PhaseWrapper";
import type { ResearchData } from "./ResearchPhase";

interface Quadrant {
  label: string;
  color: string;
  content: string;
}

function generateQuadrants(r: ResearchData): Quadrant[] {
  return [
    { label: "Think & Feel", color: "bg-purple-dark/10 border-purple-dark/20", content: r.frustrations ? `Worried about: ${r.frustrations.slice(0, 150)}. Hopes: ${(r.goals || "").slice(0, 100)}` : "Complete research to populate" },
    { label: "Hear", color: "bg-blue-100 border-blue-200", content: r.hear || "Complete research to populate" },
    { label: "See", color: "bg-emerald-50 border-emerald-200", content: r.see || "Complete research to populate" },
    { label: "Say & Do", color: "bg-amber-50 border-amber-200", content: r.day ? `Daily: ${r.day.slice(0, 100)}. Workarounds: ${(r.current || "").slice(0, 100)}` : "Complete research to populate" },
    { label: "Pains", color: "bg-red-50 border-red-200", content: r.frustrations || "Complete research to populate" },
    { label: "Gains", color: "bg-green-50 border-green-200", content: r.goals ? `${r.goals.slice(0, 150)}. Success = ${(r.success || "").slice(0, 100)}` : "Complete research to populate" },
  ];
}

interface EmpathyMapPhaseProps {
  research: ResearchData;
}

const EmpathyMapPhase = ({ research }: EmpathyMapPhaseProps) => {
  const hasResearch = Object.values(research).some((v) => v.trim());
  const quadrants = generateQuadrants(research);

  if (!hasResearch) {
    return (
      <PhaseWrapper title="Empathy Map" subtitle="Complete the Research phase first.">
        <div className="bg-muted rounded-xl p-12 text-center text-muted-foreground">
          Fill in your research answers to generate an empathy map.
        </div>
      </PhaseWrapper>
    );
  }

  return (
    <PhaseWrapper title="Empathy Map" subtitle="Toolshero 6-quadrant format — auto-generated from your research.">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {quadrants.map((q) => (
          <div key={q.label} className={`rounded-xl border p-5 ${q.color}`}>
            <h4 className="text-label font-semibold text-foreground mb-2">{q.label}</h4>
            <p className="text-sm text-foreground/80 leading-relaxed">{q.content}</p>
          </div>
        ))}
      </div>
    </PhaseWrapper>
  );
};

export default EmpathyMapPhase;
