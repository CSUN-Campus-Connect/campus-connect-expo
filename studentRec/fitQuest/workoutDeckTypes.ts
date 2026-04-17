export type MuscleGroup =
  | 'Chest'
  | 'Back'
  | 'Legs'
  | 'Shoulders'
  | 'Arms'
  | 'Core'
  | 'Full Body'
  | 'Cardio';

export type WorkoutCard = {
  id: string;
  name: string;
  description: string;
  group: MuscleGroup;
  image: string;
  sets?: string;
  focuses?: MuscleGroup[];
};
