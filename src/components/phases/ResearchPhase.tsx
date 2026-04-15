import PhaseWrapper from "../PhaseWrapper";
import PhaseFooter from "../PhaseFooter";
import AutoSaveField from "../AutoSaveField";

export interface ResearchData {
  name: string;
  day: string;
  hear: string;
  see: string;
  frustrations: string;
  goals: string;
  current: string;
  success: string;
}

const questions: { key: keyof ResearchData; label: string; placeholder: string }[] = [
  { key: "name", label: "User Name & Role", placeholder: "e.g. Sarah, Senior Product Manager at a fintech startup" },
  { key: "day", label: "Typical Day", placeholder: "Describe a typical day in their work life..." },
  { key: "hear", label: "What They Hear", placeholder: "What do colleagues, bosses, and industry voices tell them?" },
  { key: "see", label: "What They See", placeholder: "What's in their environment? What tools, trends, competitors do they see?" },
  { key: "frustrations", label: "Pains & Frustrations", placeholder: "What frustrates them? What obstacles do they face?" },
  { key: "goals", label: "Goals & Gains", placeholder: "What are they trying to achieve? What does success look like?" },
  { key: "current", label: "Current Workarounds", placeholder: "How do they solve this problem today without your product?" },
  { key: "success", label: "Definition of Success", placeholder: "How would they measure if a new solution truly worked?" },
];

interface ResearchPhaseProps {
  research: ResearchData;
  onUpdate: (research: ResearchData) => void;
  onNext: () => void;
}

const ResearchPhase = ({ research, onUpdate, onNext }: ResearchPhaseProps) => (
  <PhaseWrapper
    title="Market Research"
    subtitle="Answer these 8 questions about your target user. Your answers will power the persona, empathy map, and journey map."
  >
    <div className="space-y-5">
      {questions.map((q) => (
        <AutoSaveField
          key={q.key}
          label={q.label}
          value={research[q.key]}
          onChange={(val) => onUpdate({ ...research, [q.key]: val })}
          placeholder={q.placeholder}
          multiline
          rows={3}
        />
      ))}
    </div>
    <PhaseFooter onNext={onNext} nextLabel="Continue to Persona" />
  </PhaseWrapper>
);

export default ResearchPhase;
