export type Member = { name: string; email: string };

export type Party = {
  name: string;
  time: string;
  date: string;
  recurring: boolean;
  recurringDays?: number[];
  durationMins: number;
  focus: string;
  maxMembers: number;
  members: Member[];
};

export type GoalType = 'pr' | 'max_reps' | 'reps' | 'duration' | 'distance';

export const GOAL_LABEL: Record<GoalType, string> = {
  pr: 'PR',
  max_reps: 'Max reps',
  reps: 'Reps',
  duration: 'Duration',
  distance: 'Distance',
};

export type QuestEntry = {
  name: string;
  weight?: number;
  reps?: number;
  repsOnly?: number;
  durationMins?: number;
  distance?: number;
  at: number;
  score: number;
};

export type Quest = {
  partyIndex: number;
  exercise: string;
  goal: GoalType;
  entries: QuestEntry[];
  startedAt: number;
  imageSrc?: string;
};

export type Milestone = {
  id: string;
  label: string;
  target: number;
  current: number;
  unit: string;
};
