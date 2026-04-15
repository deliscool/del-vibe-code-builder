import { useState } from "react";
import PhaseWrapper from "../PhaseWrapper";
import PhaseFooter from "../PhaseFooter";
import type { ResearchData } from "./ResearchPhase";
import type { BriefData } from "./BriefPhase";
import journeyMapTemplate from "@/assets/templates/journey-map-template.jpg";
import journeyMapLanes from "@/assets/templates/journey-map-lanes.jpg";
import { Check } from "lucide-react";

const phaseLabels = ["Awareness", "Consideration", "Decision", "Onboarding"];
const lanes = ["Doing", "Thinking", "Feeling", "Touchpoints", "Opportunities"];

export interface JourneyMapData {
  cells: string[][];
}

function generateMap(brief: BriefData, research: ResearchData): string[][] {
  const name = research.name?.split(",")[0]?.trim() || "User";
  return [
    [
      `${name} notices the problem in daily work`,
      `Researches solutions, compares tools`,
      `Chooses a solution, signs up`,
      `Sets up account, completes first task`,
    ],
    [
      research.frustrations ? `"${research.frustrations.slice(0, 60)}..."` : `"There must be a better way"`,
      `"Which tool fits my needs best?"`,
      `"Will this actually solve my problem?"`,
      `"How quickly can I see value?"`,
    ],
    [
      "Frustrated, overwhelmed",
      "Curious but cautious",
      "Hopeful, slightly anxious",
      "Excited or confused",
    ],
    [
      research.hear ? research.hear.slice(0, 60) : "Word of mouth, social media",
      brief.summary ? `Product page: ${brief.summary.slice(0, 50)}` : "Website, demos, reviews",
      "Pricing page, free trial, onboarding",
      "Dashboard, docs, support",
    ],
    [
      "Clear messaging about value prop",
      brief.problems ? `Address: ${brief.problems.slice(0, 60)}` : "Address key pain points upfront",
      "Reduce friction in sign-up flow",
      research.success ? `Define success: ${research.success.slice(0, 60)}` : "Quick time-to-value experience",
    ],
  ];
}

interface JourneyMapPhaseProps {
  brief: BriefData;
  research: ResearchData;
  journeyMap: JourneyMapData | null;
  onUpdate: (data: JourneyMapData) => void;
  onNext: () => void;
}

const JourneyMapPhase = ({ brief, research, journeyMap, onUpdate, onNext }: JourneyMapPhaseProps) => {
  const hasData = Object.values(research).some((v) => v.trim()) || Object.values(brief).some((v) => v.trim());
  const generated = generateMap(brief, research);
  const cells = journeyMap?.cells || (hasData ? generated : null);
  const [saved, setSaved] = useState(false);

  if (!hasData) {
    return (
      <PhaseWrapper title="Customer Journey Map" subtitle="Complete Brief and Research phases first.">
        <div className="bg-muted rounded-xl p-12 text-center text-muted-foreground">
          Fill in your brief and research to generate a journey map.
        </div>
      </PhaseWrapper>
    );
  }

  if (!cells) return null;

  const handleCellChange = (laneIdx: number, phaseIdx: number, value: string) => {
    const updated = cells.map((row) => [...row]);
    updated[laneIdx][phaseIdx] = value;
    onUpdate({ cells: updated });
  };

  const handleSave = () => {
    onUpdate({ cells });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    onUpdate({ cells: generateMap(brief, research) });
  };

  return (
    <PhaseWrapper title="Customer Journey Map" subtitle="ServiceNow 5-lane swim lane format — edit each cell to customize your journey map.">
      {/* Reference templates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="rounded-xl border border-border overflow-hidden bg-card">
          <div className="bg-muted/50 px-4 py-2 border-b border-border">
            <p className="text-xs text-muted-foreground font-medium">📋 Reference: ServiceNow 5-Lane Swim Lanes</p>
          </div>
          <img
            src={journeyMapLanes}
            alt="ServiceNow journey mapping 5 swim lanes"
            className="w-full max-h-[220px] object-contain"
            loading="lazy"
          />
        </div>
        <div className="rounded-xl border border-border overflow-hidden bg-card">
          <div className="bg-muted/50 px-4 py-2 border-b border-border">
            <p className="text-xs text-muted-foreground font-medium">📋 Reference: ServiceNow Journey Map Visualization</p>
          </div>
          <img
            src={journeyMapTemplate}
            alt="ServiceNow complete journey map visualization"
            className="w-full max-h-[220px] object-contain"
            loading="lazy"
          />
        </div>
      </div>

      {/* Generated journey map table (read-only preview) */}
      <h3 className="font-heading font-bold text-foreground text-sm mb-3">📊 Your Journey Map</h3>
      <div className="overflow-x-auto mb-8">
        <div className="min-w-[700px]">
          <div className="grid grid-cols-5 gap-px bg-border rounded-t-xl overflow-hidden">
            <div className="bg-primary p-3 text-primary-foreground text-label font-semibold" />
            {phaseLabels.map((p) => (
              <div key={p} className="bg-primary p-3 text-primary-foreground text-label font-semibold text-center">
                {p}
              </div>
            ))}
          </div>
          {lanes.map((lane, li) => (
            <div key={lane} className="grid grid-cols-5 gap-px bg-border">
              <div className="bg-card p-3 font-medium text-sm text-primary">{lane}</div>
              {cells[li].map((cell, ci) => (
                <div
                  key={ci}
                  className={`p-3 text-xs leading-relaxed ${li === lanes.length - 1 ? "bg-gold/5" : "bg-card"}`}
                >
                  {cell}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Editable form matching the table */}
      <div className="rounded-xl border-2 border-primary/20 bg-card overflow-hidden mb-6">
        <div className="bg-primary/5 px-5 py-3 border-b border-primary/10">
          <h3 className="font-heading font-bold text-primary text-sm">✏️ Edit Journey Map</h3>
          <p className="text-xs text-muted-foreground mt-1">Customize each cell below. Your edits will appear in the table above and in the final export.</p>
        </div>

        <div className="p-5 space-y-6">
          {lanes.map((lane, li) => (
            <div key={lane}>
              <h4 className="font-heading font-bold text-foreground text-sm mb-3 flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${
                  li === 0 ? "bg-primary" :
                  li === 1 ? "bg-purple-500" :
                  li === 2 ? "bg-amber-500" :
                  li === 3 ? "bg-blue-500" :
                  "bg-green-500"
                }`} />
                {lane}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {phaseLabels.map((phase, ci) => (
                  <div key={ci}>
                    <label className="text-label text-muted-foreground mb-1 block">{phase}</label>
                    <textarea
                      value={cells[li][ci]}
                      onChange={(e) => handleCellChange(li, ci, e.target.value)}
                      rows={2}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                      placeholder={`${lane} during ${phase}...`}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Save + Reset buttons inside the form */}
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
            {saved ? "Saved!" : "💾 Save Journey Map"}
          </button>
        </div>
      </div>

      <p className="text-xs text-muted-foreground mt-3 text-center italic">
        Based on ServiceNow Customer Journey Mapping Guide — www.servicenow.com
      </p>
      <PhaseFooter onNext={onNext} nextLabel="Continue to Roadmap" showSave={false} />
    </PhaseWrapper>
  );
};

export default JourneyMapPhase;
