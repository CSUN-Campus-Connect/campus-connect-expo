/**
 * Profile shape aligned with `campus-connect-client` `src/app/profile/page.tsx` (`Profile`).
 * Used with bundled preview data for the profile screen.
 */
export type ExpoProfile = {
  first: string;
  middle?: string;
  last: string;
  username?: string;
  email: string;
  discord?: string;
  major?: string;
  year?: string;
  bio?: string;
  linkedin?: string;
  interests?: string[];
  portfolio?: string;
  avatar?: string;
  banner?: string;
  location?: string;
  followers?: number;
  following?: number;
  posts?: number;
  pronouns?: string;
};

export type ProfilePost = {
  id: string;
  text?: string;
  createdAt: string;
  likes: number;
  comments: number;
};
