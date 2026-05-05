import type { AppPage } from '../types/feed.types';

/** Right-sidebar search targets — aligned with web `SEARCH_INDEX`. */
export const SEARCH_INDEX: { label: string; page?: AppPage; href?: string; internal?: boolean }[] = [
  { label: 'Home', page: 'feed' },
  { label: 'Campus Events', page: 'events' },
  { label: 'Marketplace', page: 'marketplace' },
  { label: 'Notifications', page: 'notifications' },
  { label: 'My Profile', page: 'profile' },
  { label: 'Saved Posts', page: 'saved' },
  { label: 'Settings', page: 'settings' },
  { label: 'Student Rec Center', href: '/student-rec', internal: true },
  { label: 'Clubs', href: '/clubs', internal: true },
  { label: 'Academics', href: '/academics', internal: true },
  { label: 'Messages', href: '/messages', internal: true },
  { label: 'Dashboard', href: '/home', internal: true },
  { label: 'Library', href: 'https://library.csun.edu', internal: false },
  { label: 'Canvas', href: 'https://canvas.csun.edu', internal: false },
];

/** Left sidebar nav — aligned with `SocialFeedPage.tsx` `NAV_ITEMS`. */
export const NAV_ITEMS: { page: AppPage; label: string }[] = [
  { page: 'feed', label: 'Home' },
  { page: 'notifications', label: 'Notifications' },
  { page: 'saved', label: 'Saved' },
  { page: 'events', label: 'Events' },
  { page: 'marketplace', label: 'Marketplace' },
  { page: 'profile', label: 'Profile' },
  { page: 'settings', label: 'Settings' },
];

export const TRENDING = [
  { tag: 'FinalsWeek', count: '2.1K posts' },
  { tag: 'SpringCareerFair', count: 'Trending · Career' },
  { tag: 'CSUNEvents', count: '1.4K posts' },
  { tag: 'MatadorPride', count: 'Trending · CSUN' },
  { tag: 'COMP490', count: 'Trending · Academics' },
  { tag: 'OviattLibrary', count: '612 posts' },
  { tag: 'SRCOpenGym', count: 'Trending · Recreation' },
  { tag: 'HousingApplications', count: 'Trending · Student Life' },
];

export type QuickLink = {
  label: string;
  href: string;
  internal: boolean;
};

export const QUICK_LINKS: QuickLink[] = [
  { label: 'SRC', href: '/student-rec', internal: true },
  { label: 'Library', href: 'https://library.csun.edu', internal: false },
  { label: 'SOLAR', href: 'https://www.csun.edu/it/software-services/services/solar', internal: false },
  { label: 'Canvas', href: 'https://canvas.csun.edu', internal: false },
  { label: 'Dining', href: 'https://dineoncampus.com/CSUN', internal: false },
  { label: 'Parking', href: 'https://www.csun.edu/parking', internal: false },
];

export const FOLLOWING_USERS = [
  { id: 'u1', name: 'Sara Hussein', role: 'Student', initials: 'SH' },
  { id: 'u2', name: 'Justin Ayson', role: 'Student', initials: 'JA' },
  { id: 'u3', name: 'Joseph Forsyth', role: 'Student', initials: 'JF' },
  { id: 'u4', name: 'Elijah Cortez', role: 'Student', initials: 'EC' },
  { id: 'u5', name: 'Ivan Juarez', role: 'Student', initials: 'IJ' },
  { id: 'u6', name: 'Vram Ghazourian', role: 'Student', initials: 'VG' },
  { id: 'u7', name: 'Gisselle Burgos', role: 'Student', initials: 'GB' },
];

export const CLUBS_PREVIEW = [
  { id: 'acm', name: 'ACM @ CSUN', category: 'Computer Science', tagline: 'Software, workshops, and networking.' },
  { id: 'ieee', name: 'IEEE Student Branch', category: 'Engineering', tagline: 'Projects, competitions, and speaker events.' },
  { id: 'gdc', name: 'Game Dev Club', category: 'Creative Tech', tagline: 'Build games and ship projects together.' },
  { id: 'ai', name: 'AI / ML Club', category: 'Computer Science', tagline: 'Machine learning, deep dives, and research projects.' },
];

export const CAMPUS_RESOURCES = [
  {
    id: 'academic-cal',
    category: 'Academics',
    color: '#2563eb',
    title: 'Academic Calendar',
    desc: 'Key dates: registration, finals, holidays, and semester deadlines.',
    url: 'https://www.csun.edu/current-students/student-academic-calendars',
  },
  {
    id: 'tutoring',
    category: 'Learning Support',
    color: '#7c3aed',
    title: 'Tutoring & Learning Resources',
    desc: 'Free tutoring, writing workshops, and supplemental instruction at the Learning Resource Center.',
    url: 'https://www.csun.edu/undergraduate-studies/learning-resource-center',
  },
  {
    id: 'financial-aid',
    category: 'Financial Aid',
    color: '#16a34a',
    title: 'Financial Aid & Scholarships',
    desc: 'Apply for grants, loans, scholarships, and check your aid status via SOLAR.',
    url: 'https://www.csun.edu/financialaid',
  },
  {
    id: 'health',
    category: 'Health & Wellness',
    color: '#dc2626',
    title: 'Student Health Center',
    desc: 'Medical appointments, mental health counseling, wellness programs, and urgent care on campus.',
    url: 'https://www.csun.edu/shc',
  },
  {
    id: 'career',
    category: 'Career',
    color: '#0891b2',
    title: 'Career Center',
    desc: 'Resume reviews, interview prep, job/internship postings, and employer fairs via Handshake.',
    url: 'https://www.csun.edu/career-center',
  },
  {
    id: 'library',
    category: 'Research',
    color: '#b45309',
    title: 'Oviatt Library',
    desc: 'Research databases, study rooms, 3D printing, media lab, and 24/7 online resources.',
    url: 'https://library.csun.edu',
  },
];
