import type { ExpoProfile, ProfilePost } from '../types';

/** Rich preview profile — mirrors fields used on the web profile page. */
export const MOCK_PROFILE: ExpoProfile = {
  first: 'Student',
  last: '1',
  username: 'student.one',
  email: 'student1@my.csun.edu',
  pronouns: 'he/him',
  major: 'Computer Science',
  year: 'Senior',
  bio:
    'CSUN Matador · ACM chapter · Building Toro Campus Connect. Ask him about senior design, internships, or the SRC climbing wall.',
  linkedin: 'linkedin.com/in/student-one-csun',
  discord: 'student1#0420',
  location: 'Northridge, CA',
  interests: [
    'Web dev',
    'HCI',
    'Campus events',
    'Basketball',
    'Coffee on Sierra Walk',
    'Study groups',
  ],
  portfolio: 'https://drive.google.com/file/d/example-portfolio-pdf',
  followers: 428,
  following: 196,
  posts: 34,
  banner:
    'https://images.unsplash.com/photo-1498243691581-b45c9c221c78?w=1200&q=80',
  avatar:
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
};

export const MOCK_PROFILE_POSTS: ProfilePost[] = [
  {
    id: 'p1',
    text: 'Wrapped the sprint demo for Campus Connect — thanks to everyone who stress-tested the new messaging flow.',
    createdAt: '2026-04-12T18:30:00Z',
    likes: 56,
    comments: 9,
  },
  {
    id: 'p2',
    text: 'ACM meetup Thursday 6pm in JD 1404 — pizza on us. Bring a friend.',
    createdAt: '2026-04-08T14:00:00Z',
    likes: 124,
    comments: 22,
  },
  {
    id: 'p3',
    text: 'Taking CSUN 375 this semester — looking for a midterm study group if anyone is free evenings.',
    createdAt: '2026-04-02T09:15:00Z',
    likes: 31,
    comments: 14,
  },
];
