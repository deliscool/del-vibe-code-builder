import { Check, ArrowRight } from "lucide-react";
import { useState } from "react";

interface PhaseFooterProps {
  onNext: () => void;
  nextLabel: string;
  showSave?: boolean;
  onSave?: () => void;
  saveDisabled?: boolean;
}

const PhaseFooter = ({ onNext, nextLabel, showSave = true, onSave, saveDisabled }: PhaseFooterProps) => {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    onSave?.();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
      {showSave && (
        <button
          onClick={handleSave}
          disabled={saveDisabled}
          className="flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-primary text-primary font-heading font-bold text-sm hover:bg-primary/5 transition disabled:opacity-40"
        >
          {saved ? <Check className="w-4 h-4" /> : null}
          {saved ? "Saved!" : "💾 Save Progress"}
        </button>
      )}
      <button
        onClick={onNext}
        className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gold text-accent-foreground font-heading font-bold text-base shadow-lg hover:brightness-110 transition"
      >
        {nextLabel} <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
};

export default PhaseFooter;
