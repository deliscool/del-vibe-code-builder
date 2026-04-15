import { RefreshCw } from "lucide-react";
import PhaseWrapper from "../PhaseWrapper";
import type { ResearchData } from "./ResearchPhase";

export interface PersonaData {
  name: string;
  initials: string;
  displayName: string;
  roleInfo: string;
  details: string[];
  goal: string;
}

function generatePersona(r: ResearchData): PersonaData {
  const name = r.name?.split(",")[0]?.trim() || "Alex";
  const initials = name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2) || "AX";
  const role = r.name?.split(",").slice(1).join(",").trim() || "Product professional";
  const details = [
    r.day ? `Day-to-day: ${r.day.slice(0, 120)}` : "",
    r.current ? `Current tools: ${r.current.slice(0, 120)}` : "",
    r.hear ? `Influenced by: ${r.hear.slice(0, 120)}` : "",
    r.see ? `Environment: ${r.see.slice(0, 120)}` : "",
  ].filter(Boolean);
  const goal = r.goals || r.success || "Achieve product-market fit faster";
  return { name, initials, displayName: name, roleInfo: role, details, goal };
}

interface PersonaPhaseProps {
  research: ResearchData;
  persona: PersonaData | null;
  onUpdate: (persona: PersonaData) => void;
}

const PersonaPhase = ({ research, persona, onUpdate }: PersonaPhaseProps) => {
  const hasResearch = Object.values(research).some((v) => v.trim());
  const data = persona || (hasResearch ? generatePersona(research) : null);

  const handleRegenerate = () => onUpdate(generatePersona(research));

  if (!hasResearch) {
    return (
      <PhaseWrapper title="Persona Builder" subtitle="Complete the Research phase first to auto-generate a persona.">
        <div className="bg-muted rounded-xl p-12 text-center text-muted-foreground">
          Fill in your research answers to generate a persona.
        </div>
      </PhaseWrapper>
    );
  }

  if (!data) return null;

  return (
    <PhaseWrapper title="Persona Builder" subtitle="Roman Pichler format — auto-generated from your research.">
      <button
        onClick={handleRegenerate}
        className="flex items-center gap-2 mb-6 px-4 py-2 rounded-lg border border-border text-muted-foreground hover:bg-muted transition text-sm"
      >
        <RefreshCw className="w-4 h-4" /> Regenerate
      </button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Column 1: Avatar & name */}
        <div className="bg-primary rounded-xl p-6 flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full bg-gold flex items-center justify-center text-accent-foreground text-2xl font-heading font-bold mb-4">
            {data.initials}
          </div>
          <h3 className="text-lg font-heading font-bold text-primary-foreground">{data.displayName}</h3>
          <p className="text-sm text-primary-foreground/70 mt-1">{data.roleInfo}</p>
        </div>

        {/* Column 2: Details */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h4 className="text-label text-muted-foreground mb-3">Details</h4>
          <ul className="space-y-3">
            {data.details.map((d, i) => (
              <li key={i} className="text-sm text-foreground leading-relaxed">• {d}</li>
            ))}
          </ul>
        </div>

        {/* Column 3: Goal */}
        <div className="bg-gold/10 border border-gold/20 rounded-xl p-6">
          <h4 className="text-label text-gold-dark mb-3">Primary Goal</h4>
          <p className="text-foreground leading-relaxed">{data.goal}</p>
        </div>
      </div>
    </PhaseWrapper>
  );
};

export default PersonaPhase;
