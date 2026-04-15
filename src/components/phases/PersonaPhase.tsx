import { useState } from "react";
import { RefreshCw, Camera, Search, Target, Check, Plus, X } from "lucide-react";
import PhaseWrapper from "../PhaseWrapper";
import PhaseFooter from "../PhaseFooter";
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

function getInitials(name: string): string {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2) || "??";
}

interface PersonaPhaseProps {
  research: ResearchData;
  persona: PersonaData | null;
  onUpdate: (persona: PersonaData) => void;
  onNext: () => void;
}

const PersonaPhase = ({ research, persona, onUpdate, onNext }: PersonaPhaseProps) => {
  const hasResearch = Object.values(research).some((v) => v.trim());
  const data = persona || (hasResearch ? generatePersona(research) : null);
  const [saved, setSaved] = useState(false);
  const [newDetail, setNewDetail] = useState("");

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

  const handleChange = (field: keyof PersonaData, value: string) => {
    const updated = { ...data, [field]: value };
    if (field === "displayName") {
      updated.initials = getInitials(value);
    }
    onUpdate(updated);
  };

  const handleDetailChange = (index: number, value: string) => {
    const updated = [...data.details];
    updated[index] = value;
    onUpdate({ ...data, details: updated });
  };

  const handleAddDetail = () => {
    if (!newDetail.trim()) return;
    onUpdate({ ...data, details: [...data.details, newDetail.trim()] });
    setNewDetail("");
  };

  const handleRemoveDetail = (index: number) => {
    onUpdate({ ...data, details: data.details.filter((_, i) => i !== index) });
  };

  const handleSave = () => {
    onUpdate(data);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <PhaseWrapper title="Persona Builder" subtitle="Roman Pichler format — edit fields below to customize your persona.">
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

      {/* Display card — Roman Pichler 3-column layout */}
      <h3 className="font-heading font-bold text-foreground text-sm mb-3">📊 Your Persona</h3>
      <div className="rounded-xl border-2 border-border overflow-hidden mb-8">
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
        <div className="grid grid-cols-1 md:grid-cols-3">
          <div className="p-6 flex flex-col items-center text-center border-b md:border-b-0 md:border-r border-border">
            <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-3xl font-heading font-bold mb-4 shadow-md">
              {data.initials}
            </div>
            <h3 className="text-xl font-heading font-bold text-foreground">{data.displayName}</h3>
            <p className="text-sm text-muted-foreground mt-1">{data.roleInfo}</p>
          </div>
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
          <div className="p-6">
            <p className="text-foreground leading-relaxed font-medium">{data.goal}</p>
          </div>
        </div>
      </div>

      {/* Editable form */}
      <div className="rounded-xl border-2 border-primary/20 bg-card overflow-hidden mb-6">
        <div className="bg-primary/5 px-5 py-3 border-b border-primary/10">
          <h3 className="font-heading font-bold text-primary text-sm">✏️ Edit Persona</h3>
          <p className="text-xs text-muted-foreground mt-1">Customize name, role, details, and goal. Changes appear in the card above and in your final export.</p>
        </div>

        <div className="p-5 space-y-5">
          {/* Name & Role */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-label font-semibold text-foreground mb-1.5 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary" />
                Name
              </label>
              <input
                type="text"
                value={data.displayName}
                onChange={(e) => handleChange("displayName", e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                placeholder="e.g. Pete"
              />
            </div>
            <div>
              <label className="text-label font-semibold text-foreground mb-1.5 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-500" />
                Role
              </label>
              <input
                type="text"
                value={data.roleInfo}
                onChange={(e) => handleChange("roleInfo", e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                placeholder="e.g. IT Service Manager at a mid-size company"
              />
            </div>
          </div>

          {/* Details */}
          <div>
            <label className="text-label font-semibold text-foreground mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              Details
            </label>
            <div className="space-y-2">
              {data.details.map((d, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    type="text"
                    value={d}
                    onChange={(e) => handleDetailChange(i, e.target.value)}
                    className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                  />
                  <button
                    onClick={() => handleRemoveDetail(i)}
                    className="p-2 rounded-lg border border-border text-muted-foreground hover:bg-red-50 hover:text-red-500 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newDetail}
                  onChange={(e) => setNewDetail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddDetail()}
                  className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                  placeholder="Add a new detail..."
                />
                <button
                  onClick={handleAddDetail}
                  className="p-2 rounded-lg border border-border text-muted-foreground hover:bg-primary/5 hover:text-primary transition"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Goal */}
          <div>
            <label className="text-label font-semibold text-foreground mb-1.5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              Goal
            </label>
            <textarea
              value={data.goal}
              onChange={(e) => handleChange("goal", e.target.value)}
              rows={2}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
              placeholder="What is this persona trying to achieve?"
            />
          </div>
        </div>

        <div className="px-5 py-4 border-t border-border bg-muted/30 flex items-center justify-between">
          <button
            onClick={handleRegenerate}
            className="text-xs px-4 py-2 rounded-lg border border-border text-muted-foreground hover:bg-muted transition flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Reset to Auto-Generated
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition shadow-sm"
          >
            {saved ? <Check className="w-4 h-4" /> : null}
            {saved ? "Saved!" : "💾 Save Persona"}
          </button>
        </div>
      </div>

      <p className="text-xs text-muted-foreground mt-3 text-center italic">
        Based on Roman Pichler's Persona Template — www.romanpichler.com
      </p>
      <PhaseFooter onNext={onNext} nextLabel="Continue to Empathy Map" showSave={false} />
    </PhaseWrapper>
  );
};

export default PersonaPhase;
