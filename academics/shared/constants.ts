/** Mirrors `campus-connect-client/src/components/academics/shared/constants.ts` (types only; no MUI). */

export const LS_KEY = 'academics.degreePlanner.v2';

export type ToastType = 'info' | 'success' | 'warning' | 'error';

export type LectureNote = {
  id: string;
  author: string;
  topicTitle: string;
  body: string;
  createdAt: string;
  isPublic: boolean;
};

export type ResourceItem = {
  id: string;
  label: string;
  url?: string;
  fileName?: string;
  fileType?: string;
  createdAt: string;
  isPublic: boolean;
};

export const CARD_COLORS = [
  { value: 'default', label: 'Red', accent: '#A80532', border: '#f3b8c8', bg: '#fff5f7' },
  { value: 'blue', label: 'Blue', accent: '#2563eb', border: '#bfdbfe', bg: '#eff6ff' },
  { value: 'emerald', label: 'Emerald', accent: '#059669', border: '#a7f3d0', bg: '#ecfdf5' },
  { value: 'violet', label: 'Violet', accent: '#7c3aed', border: '#ddd6fe', bg: '#f5f3ff' },
  { value: 'amber', label: 'Amber', accent: '#d97706', border: '#fde68a', bg: '#fffbeb' },
  { value: 'rose', label: 'Rose', accent: '#e11d48', border: '#fecdd3', bg: '#fff1f2' },
  { value: 'sky', label: 'Sky', accent: '#0284c7', border: '#bae6fd', bg: '#f0f9ff' },
  { value: 'slate', label: 'Slate', accent: '#475569', border: '#cbd5e1', bg: '#f8fafc' },
] as const;

/** Extra palette options used by course cards (matches web `CourseCard` extras). */
export type CardColorValue = (typeof CARD_COLORS)[number]['value'] | 'teal';

export type CourseItem = {
  id: string;
  subject: string;
  number: string;
  title?: string;
  professor?: string;
  description?: string;
  prerequisitesText?: string;
  units?: number;
  days?: string[];
  startTime?: string;
  endTime?: string;
  semester?: string;
  isOnline?: boolean;
  cardColor?: CardColorValue;
  location?: string;
  sectionId?: string;
  notes: LectureNote[];
  resources: ResourceItem[];
  assignments?: Assignment[];
  exams?: ExamItem[];
};

export type Assignment = {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
};

export type ExamItem = {
  id: string;
  title: string;
  date: string;
  type: 'exam' | 'quiz' | 'midterm' | 'final';
  location?: string;
};

export type SemesterBucket = {
  id: string;
  courses: CourseItem[];
};

export type MajorPlan = {
  plan_id: string;
  plan_title: string;
  plan_type?: string;
  academic_groups_id?: string;
  academic_groups_title?: string;
};

export type StudyGroupMember = {
  id: string;
  name: string;
  avatar?: string;
};

export type StudyGroup = {
  id: string;
  courseSubject: string;
  courseNumber: string;
  topic: string;
  tags?: string[];
  dateTime: string;
  expiresAt?: string;
  location: string;
  isVirtual: boolean;
  meetingLink?: string;
  members: StudyGroupMember[];
  createdBy: string;
  createdAt: string;
  maxMembers?: number;
  notes?: string;
  isPrivate?: boolean;
  invitedEmails?: string[];
};

export type NoteFolderVisibility = 'public' | 'private';

export type NoteFolder = {
  id: string;
  topic: string;
  description?: string;
  subject: string;
  courseNumber?: string;
  createdAt: string;
  createdByEmail: string;
  visibility: NoteFolderVisibility;
  invitedEmails?: string[];
  tags?: string[];
  savedByMe?: boolean;
};

export type UniCartClass = {
  id: string;
  subject: string;
  number: string;
  title: string;
  professor: string;
  units: number;
  semester: string;
  isOnline: boolean;
  days: string[];
  startTime: string;
  endTime: string;
  section: string;
  seats?: number;
  seatsAvailable?: number;
};

export type UniCartProfile = {
  id: string;
  name: string;
  avatar?: string;
  major: string;
  year: string;
  classes: UniCartClass[];
};
