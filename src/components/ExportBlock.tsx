import { useState } from "react";
import { Copy, Check, Download } from "lucide-react";
import type { BriefData } from "./phases/BriefPhase";
import type { ResearchData } from "./phases/ResearchPhase";
import type { PersonaData } from "./phases/PersonaPhase";
import type { RoadmapData } from "./phases/RoadmapPhase";
import type { JourneyMapData } from "./phases/JourneyMapPhase";
import type { EmpathyMapData } from "./phases/EmpathyMapPhase";

interface ExportBlockProps {
  brief: BriefData;
  research: ResearchData;
  persona: PersonaData | null;
  roadmap: RoadmapData | null;
  journeyMap?: JourneyMapData | null;
  empathyMap?: EmpathyMapData | null;
}

function buildExportText(brief: BriefData, research: ResearchData, persona: PersonaData | null, roadmap: RoadmapData | null, journeyMap?: JourneyMapData | null, empathyMap?: EmpathyMapData | null): string {
  const sections: string[] = [];

  // Brief
  sections.push("# PRODUCT BRIEF");
  if (brief.summary) sections.push(`## Summary\n${brief.summary}`);
  if (brief.customer) sections.push(`## Target Customer\n${brief.customer}`);
  if (brief.problems) sections.push(`## Problems\n${brief.problems}`);
  if (brief.requirements) sections.push(`## Functional Requirements\n${brief.requirements}`);
  if (brief.ux) sections.push(`## UX Guidance\n${brief.ux}`);
  if (brief.data) sections.push(`## Data Model\n${brief.data}`);
  if (brief.tech) sections.push(`## Tech Stack\n${brief.tech}`);
  if (brief.other) sections.push(`## Other Notes\n${brief.other}`);

  // Persona
  if (persona) {
    sections.push("\n# PERSONA");
    sections.push(`Name: ${persona.displayName}\nRole: ${persona.roleInfo}`);
    if (persona.details.length) sections.push(persona.details.join("\n"));
    sections.push(`Goal: ${persona.goal}`);
  }

  // Empathy Map
  if (empathyMap) {
    sections.push("\n# EMPATHY MAP");
    if (empathyMap.thinkFeel) sections.push(`Think & Feel: ${empathyMap.thinkFeel}`);
    if (empathyMap.hear) sections.push(`Hear: ${empathyMap.hear}`);
    if (empathyMap.see) sections.push(`See: ${empathyMap.see}`);
    if (empathyMap.sayDo) sections.push(`Say & Do: ${empathyMap.sayDo}`);
    if (empathyMap.pains) sections.push(`Pains: ${empathyMap.pains}`);
    if (empathyMap.gains) sections.push(`Gains: ${empathyMap.gains}`);
  } else if (Object.values(research).some((v) => v.trim())) {
    sections.push("\n# EMPATHY MAP");
    if (research.frustrations) sections.push(`Think & Feel: ${research.frustrations}. Goals: ${research.goals || ""}`);
    if (research.hear) sections.push(`Hear: ${research.hear}`);
    if (research.see) sections.push(`See: ${research.see}`);
    if (research.day) sections.push(`Say & Do: ${research.day}. Current tools: ${research.current || ""}`);
    if (research.frustrations) sections.push(`Pains: ${research.frustrations}`);
    if (research.goals) sections.push(`Gains: ${research.goals}. Success: ${research.success || ""}`);
  }

  // Journey Map
  const jmLanes = ["Doing", "Thinking", "Feeling", "Touchpoints", "Opportunities"];
  const jmPhases = ["Awareness", "Consideration", "Decision", "Onboarding"];
  if (journeyMap?.cells) {
    sections.push("\n# CUSTOMER JOURNEY MAP");
    sections.push("Phases: " + jmPhases.join(" → "));
    journeyMap.cells.forEach((row, li) => {
      sections.push(`${jmLanes[li]}: ${row.join(" → ")}`);
    });
  } else if (Object.values(research).some((v) => v.trim()) || Object.values(brief).some((v) => v.trim())) {
    const name = research.name?.split(",")[0]?.trim() || "User";
    sections.push("\n# CUSTOMER JOURNEY MAP");
    sections.push("Phases: Awareness → Consideration → Decision → Onboarding");
    sections.push(`Doing: ${name} notices problem → Researches solutions → Chooses & signs up → First task`);
    sections.push(`Thinking: "${research.frustrations?.slice(0, 60) || "There must be a better way"}" → "Which fits?" → "Will it work?" → "How fast?"`);
    sections.push(`Feeling: Frustrated → Curious → Hopeful → Excited`);
    sections.push(`Touchpoints: ${research.hear?.slice(0, 60) || "Word of mouth"} → Product page → Pricing/trial → Dashboard`);
    sections.push(`Opportunities: Clear messaging → Address pains → Reduce friction → Quick value`);
  }

  // Roadmap
  if (roadmap) {
    sections.push("\n# PRODUCT ROADMAP (USER STORIES)");
    if (roadmap.mustHave.length) sections.push(`## Must Have (MVP)\n${roadmap.mustHave.map((s) => `- ${s}`).join("\n")}`);
    if (roadmap.shouldHave.length) sections.push(`## Should Have (v1.1)\n${roadmap.shouldHave.map((s) => `- ${s}`).join("\n")}`);
    if (roadmap.couldHave.length) sections.push(`## Could Have (Backlog)\n${roadmap.couldHave.map((s) => `- ${s}`).join("\n")}`);
    if (roadmap.epics?.length) {
      sections.push(`\n## Epics / Features\n${roadmap.epics.map((e) => `### ${e.name}\n${e.stories.map((s) => `- ${s}`).join("\n")}`).join("\n\n")}`);
    }
  }

  return sections.join("\n\n");
}

const ExportBlock = ({ brief, research, persona, roadmap, journeyMap, empathyMap }: ExportBlockProps) => {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const text = buildExportText(brief, research, persona, roadmap, journeyMap, empathyMap);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([text], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "product-requirements.md";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mt-10 rounded-xl border-2 border-gold/30 bg-card overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 bg-gold/10 border-b border-gold/20">
        <h3 className="font-heading font-bold text-foreground text-sm">📋 Export: Full Product Requirements</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs px-3 py-1.5 rounded-lg border border-border text-muted-foreground hover:bg-muted transition"
          >
            {expanded ? "Collapse" : "Preview"}
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg border border-border text-muted-foreground hover:bg-muted transition text-xs font-semibold"
          >
            <Download className="w-3.5 h-3.5" />
            Download .md
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-gold text-accent-foreground font-semibold text-xs hover:brightness-110 transition shadow-sm"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Copied!" : "Copy All"}
          </button>
        </div>
      </div>
      {expanded && (
        <pre className="p-5 text-xs text-foreground/80 whitespace-pre-wrap max-h-96 overflow-y-auto font-mono leading-relaxed select-all">
          {text}
        </pre>
      )}
    </div>
  );
};

export default ExportBlock;
