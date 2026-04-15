import PhaseWrapper from "../PhaseWrapper";
import type { ResearchData } from "./ResearchPhase";
import type { BriefData } from "./BriefPhase";

const phaseLabels = ["Awareness", "Consideration", "Decision", "Onboarding"];
const lanes = ["Doing", "Thinking", "Feeling", "Touchpoints", "Opportunities"];

function generateMap(brief: BriefData, research: ResearchData): string[][] {
  const name = research.name?.split(",")[0]?.trim() || "User";
  return [
    // Doing
    [
      `${name} notices the problem in daily work`,
      `Researches solutions, compares tools`,
      `Chooses a solution, signs up`,
      `Sets up account, completes first task`,
    ],
    // Thinking
    [
      research.frustrations ? `"${research.frustrations.slice(0, 60)}..."` : `"There must be a better way"`,
      `"Which tool fits my needs best?"`,
      `"Will this actually solve my problem?"`,
      `"How quickly can I see value?"`,
    ],
    // Feeling
    [
      "Frustrated, overwhelmed",
      "Curious but cautious",
      "Hopeful, slightly anxious",
      "Excited or confused",
    ],
    // Touchpoints
    [
      research.hear ? research.hear.slice(0, 60) : "Word of mouth, social media",
      brief.summary ? `Product page: ${brief.summary.slice(0, 50)}` : "Website, demos, reviews",
      "Pricing page, free trial, onboarding",
      "Dashboard, docs, support",
    ],
    // Opportunities
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
}

const JourneyMapPhase = ({ brief, research }: JourneyMapPhaseProps) => {
  const hasData = Object.values(research).some((v) => v.trim()) || Object.values(brief).some((v) => v.trim());
  const map = generateMap(brief, research);

  if (!hasData) {
    return (
      <PhaseWrapper title="Customer Journey Map" subtitle="Complete Brief and Research phases first.">
        <div className="bg-muted rounded-xl p-12 text-center text-muted-foreground">
          Fill in your brief and research to generate a journey map.
        </div>
      </PhaseWrapper>
    );
  }

  return (
    <PhaseWrapper title="Customer Journey Map" subtitle="5-lane swim lane format across 4 phases.">
      <div className="overflow-x-auto">
        <div className="min-w-[700px]">
          {/* Header */}
          <div className="grid grid-cols-5 gap-px bg-border rounded-t-xl overflow-hidden">
            <div className="bg-primary p-3 text-primary-foreground text-label font-semibold" />
            {phaseLabels.map((p) => (
              <div key={p} className="bg-primary p-3 text-primary-foreground text-label font-semibold text-center">
                {p}
              </div>
            ))}
          </div>

          {/* Lanes */}
          {lanes.map((lane, li) => (
            <div key={lane} className="grid grid-cols-5 gap-px bg-border">
              <div className="bg-card p-3 font-medium text-sm text-primary">{lane}</div>
              {map[li].map((cell, ci) => (
                <div
                  key={ci}
                  className={`p-3 text-xs leading-relaxed ${
                    li === lanes.length - 1 ? "bg-gold/5" : "bg-card"
                  }`}
                >
                  {cell}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </PhaseWrapper>
  );
};

export default JourneyMapPhase;
