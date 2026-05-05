/** Subset of campus-connect-client `social-feed/types/feed.types.ts` for Expo. */

export interface PostAuthor {
  id: string;
  firstName: string;
  lastName: string;
  profilePicture: string | null;
  userType: string;
}

export interface Post {
  id: string;
  content: string;
  images: string[];
  isRepost: boolean;
  originalPostId: string | null;
  repostComment: string | null;
  createdAt: string;
  updatedAt: string;
  User: PostAuthor;
  Post?: Post | null;
  _count: { Like: number; Comment: number; other_Post: number };
  isLikedByUser?: boolean;
  tags?: string[];
}

export type AppPage =
  | 'feed'
  | 'notifications'
  | 'saved'
  | 'events'
  | 'marketplace'
  | 'profile'
  | 'settings';

export type FeedTab = 'for-you' | 'campus' | 'clubs' | 'following';
