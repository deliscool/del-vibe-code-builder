import { RefreshCw, ExternalLink } from "lucide-react";
import PhaseWrapper from "../PhaseWrapper";
import ExportBlock from "../ExportBlock";
import type { BriefData } from "./BriefPhase";
import type { ResearchData } from "./ResearchPhase";
import type { PersonaData } from "./PersonaPhase";

export interface RoadmapData {
  mustHave: string[];
  shouldHave: string[];
  couldHave: string[];
}

function generateRoadmap(brief: BriefData, research: ResearchData, persona: PersonaData | null): RoadmapData {
  const personaName = persona?.displayName || research.name?.split(",")[0]?.trim() || "a user";
  const role = persona?.roleInfo || "product professional";

  const stories: string[] = [];

  if (brief.problems) {
    brief.problems.split(/[.\n]/).filter(Boolean).slice(0, 3).forEach((p) => {
      stories.push(`As ${personaName} (${role}), I want to ${p.trim().toLowerCase()} so that I can be more productive.`);
    });
  }

  if (brief.requirements) {
    brief.requirements.split(/[.\n]/).filter(Boolean).slice(0, 4).forEach((r) => {
      stories.push(`As ${personaName}, I want to ${r.trim().toLowerCase()} so that I can achieve my goals.`);
    });
  }

  if (research.frustrations) {
    stories.push(`As ${personaName}, I want to avoid ${research.frustrations.slice(0, 80).toLowerCase()} so that my workflow is smoother.`);
  }

  if (research.goals) {
    stories.push(`As ${personaName}, I want to ${research.goals.slice(0, 80).toLowerCase()} so that I can measure success.`);
  }

  // Fallbacks
  if (stories.length === 0) {
    stories.push(
      `As ${personaName}, I want to solve my core problem so that I can save time.`,
      `As ${personaName}, I want an intuitive interface so that I can get started quickly.`,
      `As ${personaName}, I want to track progress so that I know it's working.`
    );
  }

  const third = Math.ceil(stories.length / 3);
  return {
    mustHave: stories.slice(0, Math.max(third, 1)),
    shouldHave: stories.slice(third, third * 2),
    couldHave: stories.slice(third * 2),
  };
}

interface RoadmapPhaseProps {
  brief: BriefData;
  research: ResearchData;
  persona: PersonaData | null;
  roadmap: RoadmapData | null;
  onUpdate: (roadmap: RoadmapData) => void;
}

const bucketConfig = [
  { key: "mustHave" as const, label: "Must Have (MVP)", badge: "bg-red-100 text-red-700" },
  { key: "shouldHave" as const, label: "Should Have (v1.1)", badge: "bg-amber-100 text-amber-700" },
  { key: "couldHave" as const, label: "Could Have (Backlog)", badge: "bg-blue-100 text-blue-700" },
];

const RoadmapPhase = ({ brief, research, persona, roadmap, onUpdate }: RoadmapPhaseProps) => {
  const hasData = Object.values(brief).some((v) => v.trim()) || Object.values(research).some((v) => v.trim());
  const data = roadmap || (hasData ? generateRoadmap(brief, research, persona) : null);

  const handleRegenerate = () => onUpdate(generateRoadmap(brief, research, persona));

  if (!hasData) {
    return (
      <PhaseWrapper title="Product Roadmap" subtitle="Complete Brief and Research phases first.">
        <div className="bg-muted rounded-xl p-12 text-center text-muted-foreground">
          Fill in your brief and research to generate a roadmap.
        </div>
      </PhaseWrapper>
    );
  }

  if (!data) return null;

  const total = data.mustHave.length + data.shouldHave.length + data.couldHave.length;

  return (
    <PhaseWrapper title="Product Roadmap" subtitle="User stories bucketed by priority — ready to paste into your vibe coding tool.">
      <button
        onClick={handleRegenerate}
        className="flex items-center gap-2 mb-6 px-4 py-2 rounded-lg border border-border text-muted-foreground hover:bg-muted transition text-sm"
      >
        <RefreshCw className="w-4 h-4" /> Regenerate
      </button>

      {/* Metric cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <MetricCard label="Total Stories" value={total} />
        <MetricCard label="MVP" value={data.mustHave.length} />
        <MetricCard label="v1.1" value={data.shouldHave.length} />
        <MetricCard label="Backlog" value={data.couldHave.length} />
      </div>

      {/* Buckets */}
      <div className="space-y-6">
        {bucketConfig.map((bucket) => (
          <div key={bucket.key} className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${bucket.badge}`}>
                {bucket.label}
              </span>
            </div>
            <ul className="space-y-3">
              {data[bucket.key].map((story, i) => (
                <li key={i} className="text-sm text-foreground leading-relaxed pl-4 border-l-2 border-border select-text">
                  {story}
                </li>
              ))}
              {data[bucket.key].length === 0 && (
                <li className="text-sm text-muted-foreground italic">No stories in this bucket.</li>
              )}
            </ul>
          </div>
        ))}
      </div>

      {/* CTA */}
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
          Copy your brief and roadmap, then paste them into Claude to start building your prototype.
        </p>
      </div>
    </PhaseWrapper>
  );
};

function MetricCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-card rounded-xl border border-border p-4 text-center">
      <div className="text-2xl font-heading font-bold text-primary">{value}</div>
      <div className="text-label text-muted-foreground mt-1">{label}</div>
    </div>
  );
}

export default RoadmapPhase;
