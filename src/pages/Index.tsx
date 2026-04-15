import { useCallback, useEffect } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import PhaseNav from "../components/PhaseNav";
import TutorialPhase from "../components/phases/TutorialPhase";
import BriefPhase, { type BriefData } from "../components/phases/BriefPhase";
import ResearchPhase, { type ResearchData } from "../components/phases/ResearchPhase";
import PersonaPhase, { type PersonaData } from "../components/phases/PersonaPhase";
import EmpathyMapPhase from "../components/phases/EmpathyMapPhase";
import JourneyMapPhase from "../components/phases/JourneyMapPhase";
import RoadmapPhase, { type RoadmapData } from "../components/phases/RoadmapPhase";
import SummaryPhase from "../components/phases/SummaryPhase";

const emptyBrief: BriefData = { summary: "", customer: "", problems: "", requirements: "", ux: "", data: "", tech: "", other: "" };
const emptyResearch: ResearchData = { name: "", day: "", hear: "", see: "", frustrations: "", goals: "", current: "", success: "" };

const Index = () => {
  const [currentPhase, setCurrentPhase] = useLocalStorage("vc-currentPhase", 0);
  const [tutorialSlide, setTutorialSlide] = useLocalStorage("vc-tutorialSlide", 0);
  const [brief, setBrief] = useLocalStorage<BriefData>("vc-brief", emptyBrief);
  const [research, setResearch] = useLocalStorage<ResearchData>("vc-research", emptyResearch);
  const [persona, setPersona] = useLocalStorage<PersonaData | null>("vc-persona", null);
  const [roadmap, setRoadmap] = useLocalStorage<RoadmapData | null>("vc-roadmap", null);

  const completedPhases = [
    tutorialSlide === 9,
    Object.values(brief).some((v) => v.trim()),
    Object.values(research).some((v) => v.trim()),
    persona !== null,
    Object.values(research).some((v) => v.trim()),
    Object.values(brief).some((v) => v.trim()) || Object.values(research).some((v) => v.trim()),
    roadmap !== null,
    false, // Summary is never "completed" — it's the final destination
  ];

  const goToPhase = useCallback((phase: number) => {
    setCurrentPhase(phase);
  }, [setCurrentPhase]);

  const handleTutorialComplete = useCallback(() => {
    goToPhase(1);
  }, [goToPhase]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPhase]);

  return (
    <div className="min-h-screen bg-background">
      <PhaseNav
        currentPhase={currentPhase}
        completedPhases={completedPhases}
        onPhaseChange={setCurrentPhase}
      />

      <main className="pb-16">
        {currentPhase === 0 && (
          <TutorialPhase
            currentSlide={tutorialSlide}
            onSlideChange={setTutorialSlide}
            onComplete={handleTutorialComplete}
          />
        )}
        {currentPhase === 1 && <BriefPhase brief={brief} onUpdate={setBrief} onNext={() => goToPhase(2)} />}
        {currentPhase === 2 && <ResearchPhase research={research} onUpdate={setResearch} onNext={() => goToPhase(3)} />}
        {currentPhase === 3 && <PersonaPhase research={research} persona={persona} onUpdate={setPersona} onNext={() => goToPhase(4)} />}
        {currentPhase === 4 && <EmpathyMapPhase research={research} onNext={() => goToPhase(5)} />}
        {currentPhase === 5 && <JourneyMapPhase brief={brief} research={research} onNext={() => goToPhase(6)} />}
        {currentPhase === 6 && (
          <RoadmapPhase
            brief={brief}
            research={research}
            persona={persona}
            roadmap={roadmap}
            onUpdate={setRoadmap}
            onNext={() => goToPhase(7)}
          />
        )}
        {currentPhase === 7 && (
          <SummaryPhase
            brief={brief}
            research={research}
            persona={persona}
            roadmap={roadmap}
            onGoToPhase={goToPhase}
          />
        )}
      </main>
    </div>
  );
};

export default Index;
