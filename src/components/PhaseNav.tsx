import { Check } from "lucide-react";

const phases = [
  "Tutorial",
  "Brief",
  "Research",
  "Persona",
  "Empathy Map",
  "Journey Map",
  "Roadmap",
  "Summary",
];

interface PhaseNavProps {
  currentPhase: number;
  completedPhases: boolean[];
  onPhaseChange: (phase: number) => void;
}

const PhaseNav = ({ currentPhase, completedPhases, onPhaseChange }: PhaseNavProps) => {
  return (
    <nav className="sticky top-0 z-50 bg-primary shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center h-14 gap-1 overflow-x-auto scrollbar-hide">
          <span className="font-heading font-bold text-gold mr-4 text-lg shrink-0">
            Del VibeCode Guide
          </span>
          {phases.map((label, i) => (
            <button
              key={i}
              onClick={() => onPhaseChange(i)}
              className={`
                flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all shrink-0
                ${currentPhase === i
                  ? "bg-gold text-accent-foreground shadow-md"
                  : completedPhases[i]
                    ? "text-primary-foreground/90 hover:bg-purple-light/50"
                    : "text-primary-foreground/60 hover:bg-purple-light/30"
                }
              `}
            >
              {completedPhases[i] && currentPhase !== i && (
                <Check className="w-3.5 h-3.5 text-green-400" />
              )}
              <span className="hidden sm:inline">{label}</span>
              <span className="sm:hidden">{i + 1}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default PhaseNav;
