import { useState } from "react";
import PhaseWrapper from "../PhaseWrapper";
import PhaseFooter from "../PhaseFooter";
import type { ResearchData } from "./ResearchPhase";
import empathyMapTemplate from "@/assets/templates/empathy-map-template.jpg";
import { Check } from "lucide-react";

export interface EmpathyMapData {
  thinkFeel: string;
  hear: string;
  see: string;
  sayDo: string;
  pains: string;
  gains: string;
}

const quadrantConfig = [
  { key: "thinkFeel" as const, label: "Think & Feel", color: "bg-purple-dark/10 border-purple-dark/20", dot: "bg-purple-500" },
  { key: "hear" as const, label: "Hear", color: "bg-blue-100 border-blue-200", dot: "bg-blue-500" },
  { key: "see" as const, label: "See", color: "bg-emerald-50 border-emerald-200", dot: "bg-emerald-500" },
  { key: "sayDo" as const, label: "Say & Do", color: "bg-amber-50 border-amber-200", dot: "bg-amber-500" },
  { key: "pains" as const, label: "Pains", color: "bg-red-50 border-red-200", dot: "bg-red-500" },
  { key: "gains" as const, label: "Gains", color: "bg-green-50 border-green-200", dot: "bg-green-500" },
];

function generateEmpathyMap(r: ResearchData): EmpathyMapData {
  return {
    thinkFeel: r.frustrations ? `Worried about: ${r.frustrations.slice(0, 150)}. Hopes: ${(r.goals || "").slice(0, 100)}` : "",
    hear: r.hear || "",
    see: r.see || "",
    sayDo: r.day ? `Daily: ${r.day.slice(0, 100)}. Workarounds: ${(r.current || "").slice(0, 100)}` : "",
    pains: r.frustrations || "",
    gains: r.goals ? `${r.goals.slice(0, 150)}. Success = ${(r.success || "").slice(0, 100)}` : "",
  };
}

interface EmpathyMapPhaseProps {
  research: ResearchData;
  empathyMap: EmpathyMapData | null;
  onUpdate: (data: EmpathyMapData) => void;
  onNext: () => void;
}

const EmpathyMapPhase = ({ research, empathyMap, onUpdate, onNext }: EmpathyMapPhaseProps) => {
  const hasResearch = Object.values(research).some((v) => v.trim());
  const data = empathyMap || (hasResearch ? generateEmpathyMap(research) : null);
  const [saved, setSaved] = useState(false);

  if (!hasResearch) {
    return (
      <PhaseWrapper title="Empathy Map" subtitle="Complete the Research phase first.">
        <div className="bg-muted rounded-xl p-12 text-center text-muted-foreground">
          Fill in your research answers to generate an empathy map.
        </div>
      </PhaseWrapper>
    );
  }

  if (!data) return null;

  const handleChange = (key: keyof EmpathyMapData, value: string) => {
    onUpdate({ ...data, [key]: value });
  };

  const handleSave = () => {
    onUpdate(data);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    onUpdate(generateEmpathyMap(research));
  };

  return (
    <PhaseWrapper title="Empathy Map" subtitle="Toolshero 6-quadrant format — edit each quadrant to customize.">
      {/* Reference template */}
      <div className="mb-6 rounded-xl border border-border overflow-hidden bg-card">
        <div className="bg-muted/50 px-4 py-2 border-b border-border">
          <p className="text-xs text-muted-foreground font-medium">📋 Reference: Toolshero Empathy Map Template</p>
        </div>
        <img
          src={empathyMapTemplate}
          alt="Toolshero Empathy Map showing Think & Feel, Hear, See, Say & Do, Pains, and Gains quadrants"
          className="w-full max-h-[300px] object-contain bg-white"
          loading="lazy"
        />
      </div>

      {/* Display quadrants */}
      <h3 className="font-heading font-bold text-foreground text-sm mb-3">📊 Your Empathy Map</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {quadrantConfig.map((q) => (
          <div key={q.key} className={`rounded-xl border p-5 ${q.color}`}>
            <h4 className="text-label font-semibold text-foreground mb-2">{q.label}</h4>
            <p className="text-sm text-foreground/80 leading-relaxed">{data[q.key] || "Not yet filled in"}</p>
          </div>
        ))}
      </div>

      {/* Editable form */}
      <div className="rounded-xl border-2 border-primary/20 bg-card overflow-hidden mb-6">
        <div className="bg-primary/5 px-5 py-3 border-b border-primary/10">
          <h3 className="font-heading font-bold text-primary text-sm">✏️ Edit Empathy Map</h3>
          <p className="text-xs text-muted-foreground mt-1">Customize each quadrant. Your edits will appear above and in the final export.</p>
        </div>

        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {quadrantConfig.map((q) => (
            <div key={q.key}>
              <label className="text-label font-semibold text-foreground mb-1.5 flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${q.dot}`} />
                {q.label}
              </label>
              <textarea
                value={data[q.key]}
                onChange={(e) => handleChange(q.key, e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                placeholder={`What does the user ${q.label.toLowerCase()}?`}
              />
            </div>
          ))}
        </div>

        <div className="px-5 py-4 border-t border-border bg-muted/30 flex items-center justify-between">
          <button
            onClick={handleReset}
            className="text-xs px-4 py-2 rounded-lg border border-border text-muted-foreground hover:bg-muted transition"
          >
            🔄 Reset to Auto-Generated
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition shadow-sm"
          >
            {saved ? <Check className="w-4 h-4" /> : null}
            {saved ? "Saved!" : "💾 Save Empathy Map"}
          </button>
        </div>
      </div>

      <p className="text-xs text-muted-foreground mt-3 text-center italic">
        Based on Toolshero Empathy Map — www.toolshero.com
      </p>
      <PhaseFooter onNext={onNext} nextLabel="Continue to Journey Map" showSave={false} />
    </PhaseWrapper>
  );
};

export default EmpathyMapPhase;
