import { useState, useCallback } from "react";
import { RefreshCw, ChevronDown, ChevronRight, Layers, Plus, Trash2, GripVertical } from "lucide-react";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
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

// Unique ID: "epic-{epicIdx}-story-{storyIdx}"
function storyId(epicIdx: number, storyIdx: number) {
  return `epic-${epicIdx}-story-${storyIdx}`;
}

function parseStoryId(id: string): { epicIdx: number; storyIdx: number } | null {
  const m = id.match(/^epic-(\d+)-story-(\d+)$/);
  if (!m) return null;
  return { epicIdx: Number(m[1]), storyIdx: Number(m[2]) };
}

function epicDroppableId(epicIdx: number) {
  return `epic-droppable-${epicIdx}`;
}

function parseEpicDroppableId(id: string): number | null {
  const m = id.match(/^epic-droppable-(\d+)$/);
  return m ? Number(m[1]) : null;
}

// ─── Sortable Story Item ───
function SortableStory({
  id,
  story,
  epicIdx,
  storyIdx,
  isEditing,
  onEdit,
  onSave,
  onCancelEdit,
  onDelete,
}: {
  id: string;
  story: string;
  epicIdx: number;
  storyIdx: number;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (text: string) => void;
  onCancelEdit: () => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
    data: { type: "story", epicIdx, storyIdx },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-start gap-2 group">
      <button
        {...attributes}
        {...listeners}
        className="mt-1.5 text-muted-foreground/40 hover:text-muted-foreground cursor-grab active:cursor-grabbing shrink-0 touch-none"
        tabIndex={-1}
      >
        <GripVertical className="w-3.5 h-3.5" />
      </button>
      <span className="text-xs text-muted-foreground mt-1.5 font-mono w-5 shrink-0 text-right">
        {storyIdx + 1}.
      </span>
      {isEditing ? (
        <textarea
          autoFocus
          className="flex-1 bg-background border border-border rounded px-3 py-2 text-sm text-foreground resize-none"
          defaultValue={story}
          rows={2}
          onBlur={(e) => onSave(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onSave(e.currentTarget.value);
            }
            if (e.key === "Escape") onCancelEdit();
          }}
        />
      ) : (
        <span
          className="flex-1 text-sm text-foreground leading-relaxed cursor-text select-text"
          onDoubleClick={onEdit}
        >
          {story}
        </span>
      )}
      <button
        onClick={onDelete}
        className="text-muted-foreground hover:text-red-500 transition p-1 opacity-0 group-hover:opacity-100"
        title="Remove story"
      >
        <Trash2 className="w-3 h-3" />
      </button>
    </div>
  );
}

// ─── Generation helpers ───

function generateEpics(stories: string[], brief: BriefData): Epic[] {
  const epics: Epic[] = [];
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

  if (problemStories.length > 0) epics.push({ name: "Core Problem Resolution", stories: problemStories });
  if (uxStories.length > 0) epics.push({ name: "User Experience", stories: uxStories });
  if (featureStories.length > 0) epics.push({ name: "Tracking & Metrics", stories: featureStories });
  if (otherStories.length > 0) {
    const epicName = brief.summary ? `${brief.summary.slice(0, 40).trim()} Features` : "Core Features";
    epics.push({ name: epicName, stories: otherStories });
  }

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
  return {
    mustHave: stories.slice(0, Math.max(third, 1)),
    shouldHave: stories.slice(third, third * 2),
    couldHave: stories.slice(third * 2),
    epics: generateEpics(stories, brief),
  };
}

// ─── Props & config ───

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

// ─── Main Component ───

const RoadmapPhase = ({ brief, research, persona, roadmap, onUpdate, onNext }: RoadmapPhaseProps) => {
  const hasData = Object.values(brief).some((v) => v.trim()) || Object.values(research).some((v) => v.trim());

  const migrateData = (d: RoadmapData): RoadmapData => {
    if (!d.epics) {
      const allStories = [...d.mustHave, ...d.shouldHave, ...d.couldHave];
      return { ...d, epics: generateEpics(allStories, brief) };
    }
    return d;
  };

  const data = roadmap ? migrateData(roadmap) : hasData ? generateRoadmap(brief, research, persona) : null;

  const [expandedEpics, setExpandedEpics] = useState<Set<number>>(new Set([0]));
  const [newEpicName, setNewEpicName] = useState("");
  const [editingEpic, setEditingEpic] = useState<number | null>(null);
  const [editingStory, setEditingStory] = useState<{ epic: number; story: number } | null>(null);
  const [newStoryText, setNewStoryText] = useState("");
  const [addingStoryToEpic, setAddingStoryToEpic] = useState<number | null>(null);
  const [activeStory, setActiveStory] = useState<{ id: string; text: string } | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const handleRegenerate = () => onUpdate(generateRoadmap(brief, research, persona));

  const toggleEpic = (idx: number) => {
    setExpandedEpics((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const updateEpics = useCallback(
    (newEpics: Epic[]) => {
      if (data) onUpdate({ ...data, epics: newEpics });
    },
    [data, onUpdate]
  );

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

  // ─── DnD handlers ───

  const handleDragStart = (event: DragStartEvent) => {
    const parsed = parseStoryId(String(event.active.id));
    if (!parsed || !data) return;
    setActiveStory({ id: String(event.active.id), text: data.epics[parsed.epicIdx].stories[parsed.storyIdx] });
  };

  const handleDragOver = (event: DragOverEvent) => {
    if (!data) return;
    const { active, over } = event;
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    const activeParsed = parseStoryId(activeId);
    if (!activeParsed) return;

    // Determine target epic
    let targetEpicIdx: number | null = null;
    let targetStoryIdx: number | null = null;

    const overStory = parseStoryId(overId);
    if (overStory) {
      targetEpicIdx = overStory.epicIdx;
      targetStoryIdx = overStory.storyIdx;
    } else {
      targetEpicIdx = parseEpicDroppableId(overId);
    }

    if (targetEpicIdx === null || targetEpicIdx === activeParsed.epicIdx) return;

    // Move story to new epic during drag (live preview)
    const newEpics = data.epics.map((e) => ({ ...e, stories: [...e.stories] }));
    const [moved] = newEpics[activeParsed.epicIdx].stories.splice(activeParsed.storyIdx, 1);
    const insertIdx = targetStoryIdx !== null ? targetStoryIdx : newEpics[targetEpicIdx].stories.length;
    newEpics[targetEpicIdx].stories.splice(insertIdx, 0, moved);

    // Expand target epic
    setExpandedEpics((prev) => new Set([...prev, targetEpicIdx!]));
    updateEpics(newEpics);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveStory(null);
    if (!data) return;

    const { active, over } = event;
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);
    if (activeId === overId) return;

    const activeParsed = parseStoryId(activeId);
    const overParsed = parseStoryId(overId);

    if (!activeParsed || !overParsed) return;

    // Reorder within same epic
    if (activeParsed.epicIdx === overParsed.epicIdx) {
      const newEpics = data.epics.map((e) => ({ ...e, stories: [...e.stories] }));
      const epicStories = newEpics[activeParsed.epicIdx].stories;
      const [moved] = epicStories.splice(activeParsed.storyIdx, 1);
      epicStories.splice(overParsed.storyIdx, 0, moved);
      updateEpics(newEpics);
    }
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
    <PhaseWrapper title="Product Roadmap" subtitle="User stories bucketed by priority, grouped into epics — drag stories between epics to reorganize.">
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

      {/* Epics Section with DnD */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <Layers className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-heading font-bold text-primary">Epics / Features</h3>
            <span className="text-xs text-muted-foreground ml-auto">{totalEpicStories} stories across {data.epics.length} epics</span>
          </div>
          <p className="text-xs text-muted-foreground mb-4">Drag stories between epics to reorganize · Double-click to edit</p>

          <div className="space-y-3">
            {data.epics.map((epic, epicIdx) => {
              const isExpanded = expandedEpics.has(epicIdx);
              const storyIds = epic.stories.map((_, si) => storyId(epicIdx, si));

              return (
                <div key={epicIdx} className="bg-card rounded-xl border border-border overflow-hidden">
                  {/* Epic header */}
                  <div
                    className="flex items-center gap-3 px-5 py-4 cursor-pointer hover:bg-muted/50 transition"
                    onClick={() => toggleEpic(epicIdx)}
                  >
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
                      className="text-muted-foreground hover:text-destructive transition p-1"
                      title="Delete epic"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Epic stories — droppable zone */}
                  {isExpanded && (
                    <SortableContext items={storyIds} strategy={verticalListSortingStrategy} id={epicDroppableId(epicIdx)}>
                      <div className="border-t border-border px-5 py-3 space-y-2 bg-muted/20 min-h-[48px]">
                        {epic.stories.length === 0 && !activeStory && (
                          <p className="text-xs text-muted-foreground italic py-2 text-center">
                            Drop stories here or add one below
                          </p>
                        )}
                        {epic.stories.map((story, si) => (
                          <SortableStory
                            key={storyId(epicIdx, si)}
                            id={storyId(epicIdx, si)}
                            story={story}
                            epicIdx={epicIdx}
                            storyIdx={si}
                            isEditing={editingStory?.epic === epicIdx && editingStory?.story === si}
                            onEdit={() => setEditingStory({ epic: epicIdx, story: si })}
                            onSave={(text) => handleEditStory(epicIdx, si, text)}
                            onCancelEdit={() => setEditingStory(null)}
                            onDelete={() => handleDeleteStory(epicIdx, si)}
                          />
                        ))}

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
                    </SortableContext>
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

        {/* Drag overlay */}
        <DragOverlay>
          {activeStory && (
            <div className="bg-card border border-primary/30 rounded-lg px-4 py-2 shadow-lg text-sm text-foreground max-w-md">
              <GripVertical className="w-3.5 h-3.5 inline mr-2 text-muted-foreground" />
              {activeStory.text.length > 100 ? activeStory.text.slice(0, 100) + "…" : activeStory.text}
            </div>
          )}
        </DragOverlay>
      </DndContext>

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
