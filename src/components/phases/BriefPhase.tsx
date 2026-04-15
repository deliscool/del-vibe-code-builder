import PhaseWrapper from "../PhaseWrapper";
import AutoSaveField from "../AutoSaveField";

export interface BriefData {
  summary: string;
  customer: string;
  problems: string;
  requirements: string;
  ux: string;
  data: string;
  tech: string;
  other: string;
}

const fields: { key: keyof BriefData; label: string; placeholder: string }[] = [
  { key: "summary", label: "Product Summary", placeholder: "What does your product do in one paragraph?" },
  { key: "customer", label: "Target Customer", placeholder: "Who is your ideal user? Demographics, role, experience level..." },
  { key: "problems", label: "Customer Problems", placeholder: "What pain points does your product solve? List 3-5 problems..." },
  { key: "requirements", label: "Functional Requirements", placeholder: "What features must the product have? List specific functionality..." },
  { key: "ux", label: "UX Guidance", placeholder: "How should the product look and feel? Colors, tone, style..." },
  { key: "data", label: "Data Model", placeholder: "What data does the app need to store and manage?" },
  { key: "tech", label: "Tech Stack", placeholder: "Any technology preferences or constraints?" },
  { key: "other", label: "Other Notes", placeholder: "Anything else the AI should know..." },
];

interface BriefPhaseProps {
  brief: BriefData;
  onUpdate: (brief: BriefData) => void;
}

const BriefPhase = ({ brief, onUpdate }: BriefPhaseProps) => (
  <PhaseWrapper
    title="Product Brief"
    subtitle="Capture everything the AI needs to build your prototype. Every field auto-saves."
  >
    <div className="space-y-5">
      {fields.map((f) => (
        <AutoSaveField
          key={f.key}
          label={f.label}
          value={brief[f.key]}
          onChange={(val) => onUpdate({ ...brief, [f.key]: val })}
          placeholder={f.placeholder}
          multiline
          rows={3}
        />
      ))}
    </div>
  </PhaseWrapper>
);

export default BriefPhase;
