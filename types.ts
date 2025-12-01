
export type StatType = 'academic' | 'reputation' | 'satisfaction' | 'resources';

export interface Stats {
  academic: number;
  reputation: number;
  satisfaction: number;
  resources: number;
}

export type TraitCategory = 'professional' | 'mentorship' | 'workplace';

export interface Trait {
  id: string;
  name: string;
  category: TraitCategory;
  description: string;
  effect?: (stats: Stats) => Stats; // Initial effect
}

export interface Choice {
  text: string;
  description?: string; // Result text
  effect: (stats: Stats) => Partial<Stats>; // Returns the changes
  setFlag?: string; // Sets a flag for chain events
}

export interface GameEvent {
  id: string;
  title: string;
  description: string;
  category: 'academic' | 'student' | 'career' | 'network' | 'risk';
  choices: Choice[];
  condition?: (stats: Stats, traits: string[], studentCount: number, flags: Record<string, boolean>) => boolean;
}

export interface LogEntry {
  year: number;
  message: string;
  type: 'event' | 'achievement' | 'milestone' | 'risk';
}

export interface EventResult {
  text: string;
  changes: Partial<Stats>;
}

export interface Student {
  id: string;
  name: string;
  talent: number; // 1-10, affects academic output
  stress: number; // 1-10, affects quit rate
  status: 'active' | 'graduated' | 'quit';
  enrollmentYear: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  condition: (state: GameState) => boolean;
  reward?: Partial<Stats>;
  unlocked: boolean;
}

export interface GameState {
  year: number;
  stats: Stats;
  traits: Trait[];
  history: LogEntry[];
  phase: 'MENU' | 'CREATION' | 'PLAYING' | 'EVENT' | 'RESULT' | 'SUMMARY' | 'ENDING';
  currentEvent: GameEvent | null;
  lastEventResult: EventResult | null;
  studentCount: number; // Keep for legacy/total count
  students: Student[]; // Detailed list
  achievements: string[]; // IDs of unlocked achievements
  flags: Record<string, boolean>; // For chain events
  isGameOver: boolean;
}
