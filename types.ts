
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
  removeFlag?: string; // Removes a flag (fixes infinite loops)
}

export interface GameEvent {
  id: string;
  title: string;
  description: string;
  category: 'academic' | 'student' | 'career' | 'network' | 'risk';
  choices: Choice[];
  condition?: (stats: Stats, traits: string[], studentCount: number, flags: Record<string, boolean>, year: number) => boolean;
}

export interface LogEntry {
  year: number;
  message: string;
  type: 'event' | 'achievement' | 'milestone' | 'risk' | 'gameover' | 'upgrade' | 'promotion' | 'project';
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

export interface Upgrade {
  id: string;
  name: string;
  description: string;
  cost: number;
  passive?: (stats: Stats) => Partial<Stats>; // Yearly passive effect
}

export interface Title {
  id: string;
  name: string;
  level: number;
  condition: (state: GameState) => boolean;
  passive?: (stats: Stats) => Partial<Stats>;
}

export interface Ending {
  id: string;
  title: string;
  description: string;
  condition: (stats: Stats, achievements: string[], title: string, flags: Record<string, boolean>) => boolean;
  color: string;
  bgColor: string;
}

export interface KPI {
    year: number;
    description: string;
    condition: (stats: Stats) => boolean;
    failMessage: string;
}

export interface ProjectDefinition {
    id: string;
    name: string;
    type: 'national' | 'corporate' | 'talent';
    duration: number; // Years to complete
    reqStats: Partial<Stats>; // Requirement to apply
    costPerYear: Partial<Stats>; // Maintenance cost (e.g. academic -1 due to focus)
    reward: Partial<Stats>; // Reward on completion
    penalty: Partial<Stats>; // Penalty if failed/unfinished
    description: string;
}

export interface ActiveProject {
    defId: string;
    startYear: number;
    progress: number; // Current years completed
}

export interface GameState {
  year: number;
  stats: Stats;
  traits: Trait[];
  history: LogEntry[];
  phase: 'MENU' | 'CREATION' | 'PLAYING' | 'EVENT' | 'RESULT' | 'SUMMARY' | 'ENDING' | 'GAMEOVER';
  currentEvent: GameEvent | null;
  lastEventResult: EventResult | null;
  studentCount: number; // Keep for legacy/total count
  students: Student[]; // Detailed list
  achievements: string[]; // IDs of unlocked achievements
  flags: Record<string, boolean>; // For chain events
  isGameOver: boolean;
  gameOverReason?: string;
  endingId?: string; // ID of the specific ending triggered
  upgrades: string[]; // IDs of purchased upgrades
  title: string; // ID of current title
  activeProject: ActiveProject | null; // Currently running project
}
