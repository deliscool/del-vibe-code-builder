import { useState } from "react";
import { RefreshCw, ChevronDown, ChevronRight, Layers, Plus, Trash2, GripVertical } from "lucide-react";
import PhaseWrapper from "../PhaseWrapper";
import PhaseFooter from "../PhaseFooter";
import type { BriefData } from "./BriefPhase";
import type { ResearchData } from "./ResearchPhase";
import type { PersonaData } from "./PersonaPhase";

export interface Epic {
  name: string;
  stories: string[];
}

export interface RoadmapData {
  mustHave: string[];
  shouldHave: string[];
  couldHave: string[];
  epics: Epic[];
}

function generateEpics(stories: string[], brief: BriefData): Epic[] {
  const epics: Epic[] = [];

  // Group stories by theme based on brief sections
  const problemStories: string[] = [];
  const featureStories: string[] = [];
  const uxStories: string[] = [];
  const otherStories: string[] = [];

  stories.forEach((story) => {
    const lower = story.toLowerCase();
    if (lower.includes("avoid") || lower.includes("frustrat") || lower.includes("problem") || lower.includes("pain")) {
      problemStories.push(story);
    } else if (lower.includes("interface") || lower.includes("intuitive") || lower.includes("ux") || lower.includes("design") || lower.includes("experience")) {
      uxStories.push(story);
    } else if (lower.includes("track") || lower.includes("measure") || lower.includes("success") || lower.includes("goal") || lower.includes("progress")) {
      featureStories.push(story);
    } else {
      otherStories.push(story);
    }
  });

  if (problemStories.length > 0) {
    epics.push({ name: "Core Problem Resolution", stories: problemStories });
  }
  if (uxStories.length > 0) {
    epics.push({ name: "User Experience", stories: uxStories });
  }
  if (featureStories.length > 0) {
    epics.push({ name: "Tracking & Metrics", stories: featureStories });
  }
  if (otherStories.length > 0) {
    const epicName = brief.summary
      ? `${brief.summary.slice(0, 40).trim()} Features`
      : "Core Features";
    epics.push({ name: epicName, stories: otherStories });
  }

  // If only one epic with all stories, try splitting further
  if (epics.length === 1 && epics[0].stories.length > 3) {
    const all = epics[0].stories;
    const half = Math.ceil(all.length / 2);
    return [
      { name: "Core Functionality", stories: all.slice(0, half) },
      { name: "Enhanced Features", stories: all.slice(half) },
    ];
  }

  return epics;
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

  if (stories.length === 0) {
    stories.push(
      `As ${personaName}, I want to solve my core problem so that I can save time.`,
      `As ${personaName}, I want an intuitive interface so that I can get started quickly.`,
      `As ${personaName}, I want to track progress so that I know it's working.`
    );
  }

  const third = Math.ceil(stories.length / 3);
  const roadmap: RoadmapData = {
    mustHave: stories.slice(0, Math.max(third, 1)),
    shouldHave: stories.slice(third, third * 2),
    couldHave: stories.slice(third * 2),
    epics: generateEpics(stories, brief),
  };

  return roadmap;
}

interface RoadmapPhaseProps {
  brief: BriefData;
  research: ResearchData;
  persona: PersonaData | null;
  roadmap: RoadmapData | null;
  onUpdate: (roadmap: RoadmapData) => void;
  onNext: () => void;
}

const bucketConfig = [
  { key: "mustHave" as const, label: "Must Have (MVP)", badge: "bg-red-100 text-red-700" },
  { key: "shouldHave" as const, label: "Should Have (v1.1)", badge: "bg-amber-100 text-amber-700" },
  { key: "couldHave" as const, label: "Could Have (Backlog)", badge: "bg-blue-100 text-blue-700" },
];

const RoadmapPhase = ({ brief, research, persona, roadmap, onUpdate, onNext }: RoadmapPhaseProps) => {
  const hasData = Object.values(brief).some((v) => v.trim()) || Object.values(research).some((v) => v.trim());

  // Migrate old data without epics
  const migrateData = (d: RoadmapData): RoadmapData => {
    if (!d.epics) {
      const allStories = [...d.mustHave, ...d.shouldHave, ...d.couldHave];
      return { ...d, epics: generateEpics(allStories, brief) };
    }
    return d;
  };

  const data = roadmap
    ? migrateData(roadmap)
    : hasData
    ? generateRoadmap(brief, research, persona)
    : null;

  const [expandedEpics, setExpandedEpics] = useState<Set<number>>(new Set([0]));
  const [newEpicName, setNewEpicName] = useState("");
  const [editingEpic, setEditingEpic] = useState<number | null>(null);
  const [editingStory, setEditingStory] = useState<{ epic: number; story: number } | null>(null);
  const [newStoryText, setNewStoryText] = useState("");
  const [addingStoryToEpic, setAddingStoryToEpic] = useState<number | null>(null);

  const handleRegenerate = () => onUpdate(generateRoadmap(brief, research, persona));

  const toggleEpic = (idx: number) => {
    setExpandedEpics((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const updateEpics = (newEpics: Epic[]) => {
    if (data) onUpdate({ ...data, epics: newEpics });
  };

  const handleAddEpic = () => {
    if (!newEpicName.trim() || !data) return;
    const newEpics = [...data.epics, { name: newEpicName.trim(), stories: [] }];
    updateEpics(newEpics);
    setExpandedEpics((prev) => new Set([...prev, newEpics.length - 1]));
    setNewEpicName("");
  };

  const handleDeleteEpic = (idx: number) => {
    if (!data) return;
    updateEpics(data.epics.filter((_, i) => i !== idx));
  };

  const handleRenameEpic = (idx: number, name: string) => {
    if (!data) return;
    const newEpics = [...data.epics];
    newEpics[idx] = { ...newEpics[idx], name };
    updateEpics(newEpics);
    setEditingEpic(null);
  };

  const handleAddStory = (epicIdx: number) => {
    if (!newStoryText.trim() || !data) return;
    const newEpics = [...data.epics];
    newEpics[epicIdx] = { ...newEpics[epicIdx], stories: [...newEpics[epicIdx].stories, newStoryText.trim()] };
    updateEpics(newEpics);
    setNewStoryText("");
    setAddingStoryToEpic(null);
  };

  const handleEditStory = (epicIdx: number, storyIdx: number, text: string) => {
    if (!data) return;
    const newEpics = [...data.epics];
    const stories = [...newEpics[epicIdx].stories];
    stories[storyIdx] = text;
    newEpics[epicIdx] = { ...newEpics[epicIdx], stories };
    updateEpics(newEpics);
    setEditingStory(null);
  };

  const handleDeleteStory = (epicIdx: number, storyIdx: number) => {
    if (!data) return;
    const newEpics = [...data.epics];
    newEpics[epicIdx] = { ...newEpics[epicIdx], stories: newEpics[epicIdx].stories.filter((_, i) => i !== storyIdx) };
    updateEpics(newEpics);
  };

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
  const totalEpicStories = data.epics.reduce((sum, e) => sum + e.stories.length, 0);

  return (
    <PhaseWrapper title="Product Roadmap" subtitle="User stories bucketed by priority, grouped into epics — ready to paste into your vibe coding tool.">
      <button
        onClick={handleRegenerate}
        className="flex items-center gap-2 mb-6 px-4 py-2 rounded-lg border border-border text-muted-foreground hover:bg-muted transition text-sm"
      >
        <RefreshCw className="w-4 h-4" /> Regenerate
      </button>

      {/* Metric cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
        <MetricCard label="Total Stories" value={total} />
        <MetricCard label="MVP" value={data.mustHave.length} />
        <MetricCard label="v1.1" value={data.shouldHave.length} />
        <MetricCard label="Backlog" value={data.couldHave.length} />
        <MetricCard label="Epics" value={data.epics.length} />
      </div>

      {/* Epics Section */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Layers className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-heading font-bold text-primary">Epics / Features</h3>
          <span className="text-xs text-muted-foreground ml-auto">{totalEpicStories} stories across {data.epics.length} epics</span>
        </div>

        <div className="space-y-3">
          {data.epics.map((epic, epicIdx) => {
            const isExpanded = expandedEpics.has(epicIdx);
            return (
              <div key={epicIdx} className="bg-card rounded-xl border border-border overflow-hidden">
                {/* Epic header */}
                <div
                  className="flex items-center gap-3 px-5 py-4 cursor-pointer hover:bg-muted/50 transition"
                  onClick={() => toggleEpic(epicIdx)}
                >
                  <GripVertical className="w-4 h-4 text-muted-foreground/40 shrink-0" />
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                  )}
                  <Layers className="w-4 h-4 text-primary shrink-0" />

                  {editingEpic === epicIdx ? (
                    <input
                      autoFocus
                      className="flex-1 bg-background border border-border rounded px-2 py-1 text-sm font-semibold text-foreground"
                      defaultValue={epic.name}
                      onClick={(e) => e.stopPropagation()}
                      onBlur={(e) => handleRenameEpic(epicIdx, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleRenameEpic(epicIdx, e.currentTarget.value);
                        if (e.key === "Escape") setEditingEpic(null);
                      }}
                    />
                  ) : (
                    <span
                      className="flex-1 font-heading font-semibold text-foreground cursor-text"
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        setEditingEpic(epicIdx);
                      }}
                    >
                      {epic.name}
                    </span>
                  )}

                  <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                    {epic.stories.length} {epic.stories.length === 1 ? "story" : "stories"}
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteEpic(epicIdx);
                    }}
                    className="text-muted-foreground hover:text-red-500 transition p-1"
                    title="Delete epic"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Epic stories */}
                {isExpanded && (
                  <div className="border-t border-border px-5 py-3 space-y-2 bg-muted/20">
                    {epic.stories.map((story, storyIdx) => (
                      <div key={storyIdx} className="flex items-start gap-2 group">
                        <span className="text-xs text-muted-foreground mt-1.5 font-mono w-5 shrink-0 text-right">
                          {storyIdx + 1}.
                        </span>
                        {editingStory?.epic === epicIdx && editingStory?.story === storyIdx ? (
                          <textarea
                            autoFocus
                            className="flex-1 bg-background border border-border rounded px-3 py-2 text-sm text-foreground resize-none"
                            defaultValue={story}
                            rows={2}
                            onBlur={(e) => handleEditStory(epicIdx, storyIdx, e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleEditStory(epicIdx, storyIdx, e.currentTarget.value);
                              }
                              if (e.key === "Escape") setEditingStory(null);
                            }}
                          />
                        ) : (
                          <span
                            className="flex-1 text-sm text-foreground leading-relaxed cursor-text select-text"
                            onDoubleClick={() => setEditingStory({ epic: epicIdx, story: storyIdx })}
                          >
                            {story}
                          </span>
                        )}
                        <button
                          onClick={() => handleDeleteStory(epicIdx, storyIdx)}
                          className="text-muted-foreground hover:text-red-500 transition p-1 opacity-0 group-hover:opacity-100"
                          title="Remove story"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}

                    {/* Add story to epic */}
                    {addingStoryToEpic === epicIdx ? (
                      <div className="flex gap-2 mt-2">
                        <input
                          autoFocus
                          className="flex-1 bg-background border border-border rounded px-3 py-2 text-sm placeholder:text-muted-foreground"
                          placeholder="As [user], I want to... so that..."
                          value={newStoryText}
                          onChange={(e) => setNewStoryText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleAddStory(epicIdx);
                            if (e.key === "Escape") {
                              setAddingStoryToEpic(null);
                              setNewStoryText("");
                            }
                          }}
                        />
                        <button
                          onClick={() => handleAddStory(epicIdx)}
                          className="px-3 py-2 rounded bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition"
                        >
                          Add
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setAddingStoryToEpic(epicIdx);
                          setNewStoryText("");
                        }}
                        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition mt-1"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add story
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Add new epic */}
        <div className="flex gap-2 mt-4">
          <input
            className="flex-1 bg-card border border-border rounded-lg px-4 py-2.5 text-sm placeholder:text-muted-foreground"
            placeholder="New epic name (e.g., Onboarding, Payments, Dashboard)..."
            value={newEpicName}
            onChange={(e) => setNewEpicName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAddEpic();
            }}
          />
          <button
            onClick={handleAddEpic}
            disabled={!newEpicName.trim()}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition disabled:opacity-40"
          >
            <Plus className="w-4 h-4" /> Add Epic
          </button>
        </div>
      </div>

      {/* MoSCoW Buckets */}
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

      <PhaseFooter onNext={onNext} nextLabel="Review & Export" showSave={false} />
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
