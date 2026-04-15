import { RefreshCw, Camera, Search, Target } from "lucide-react";
import PhaseWrapper from "../PhaseWrapper";
import type { ResearchData } from "./ResearchPhase";
import personaTemplate from "@/assets/templates/persona-template.webp";

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
      {/* Reference template */}
      <div className="mb-6 rounded-xl border border-border overflow-hidden bg-card">
        <div className="bg-muted/50 px-4 py-2 border-b border-border">
          <p className="text-xs text-muted-foreground font-medium">📋 Reference: Roman Pichler's Persona Template</p>
        </div>
        <img
          src={personaTemplate}
          alt="Roman Pichler's Persona Template showing Picture & Name, Details, and Goal columns"
          className="w-full max-h-[280px] object-contain"
          loading="lazy"
        />
      </div>

      <button
        onClick={handleRegenerate}
        className="flex items-center gap-2 mb-6 px-4 py-2 rounded-lg border border-border text-muted-foreground hover:bg-muted transition text-sm"
      >
        <RefreshCw className="w-4 h-4" /> Regenerate
      </button>

      {/* Generated persona — Roman Pichler 3-column layout */}
      <div className="rounded-xl border-2 border-border overflow-hidden">
        {/* Header row */}
        <div className="grid grid-cols-1 md:grid-cols-3 border-b-2 border-border">
          <div className="flex items-center gap-3 p-4 bg-muted border-b md:border-b-0 md:border-r border-border">
            <div className="w-8 h-8 rounded-full bg-muted-foreground/20 flex items-center justify-center">
              <Camera className="w-4 h-4 text-muted-foreground" />
            </div>
            <span className="font-heading font-bold text-foreground tracking-wide uppercase text-sm">Picture & Name</span>
          </div>
          <div className="flex items-center gap-3 p-4 bg-muted border-b md:border-b-0 md:border-r border-border">
            <div className="w-8 h-8 rounded-full bg-muted-foreground/20 flex items-center justify-center">
              <Search className="w-4 h-4 text-muted-foreground" />
            </div>
            <span className="font-heading font-bold text-foreground tracking-wide uppercase text-sm">Details</span>
          </div>
          <div className="flex items-center gap-3 p-4 bg-muted">
            <div className="w-8 h-8 rounded-full bg-muted-foreground/20 flex items-center justify-center">
              <Target className="w-4 h-4 text-muted-foreground" />
            </div>
            <span className="font-heading font-bold text-foreground tracking-wide uppercase text-sm">Goal</span>
          </div>
        </div>

        {/* Content row */}
        <div className="grid grid-cols-1 md:grid-cols-3">
          {/* Column 1: Avatar & name */}
          <div className="p-6 flex flex-col items-center text-center border-b md:border-b-0 md:border-r border-border">
            <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-3xl font-heading font-bold mb-4 shadow-md">
              {data.initials}
            </div>
            <h3 className="text-xl font-heading font-bold text-foreground">{data.displayName}</h3>
            <p className="text-sm text-muted-foreground mt-1">{data.roleInfo}</p>
          </div>

          {/* Column 2: Details */}
          <div className="p-6 border-b md:border-b-0 md:border-r border-border">
            <ul className="space-y-4">
              {data.details.map((d, i) => (
                <li key={i} className="text-sm text-foreground leading-relaxed">
                  <span className="font-semibold">{d.split(":")[0]}:</span>
                  {d.split(":").slice(1).join(":")}
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Goal */}
          <div className="p-6">
            <p className="text-foreground leading-relaxed font-medium">{data.goal}</p>
          </div>
        </div>
      </div>

      <p className="text-xs text-muted-foreground mt-3 text-center italic">
        Based on Roman Pichler's Persona Template — www.romanpichler.com
      </p>
    </PhaseWrapper>
  );
};

export default PersonaPhase;
