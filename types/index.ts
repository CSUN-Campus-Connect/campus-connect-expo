export interface User {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  role: 'student' | 'faculty' | 'alumni';
  createdAt: string;
}

export interface Post {
  id: string;
  content: string;
  author: User;
  createdAt: string;
  updatedAt: string;
  likesCount: number;
  commentsCount: number;
}

export interface ApiError {
  message: string;
  status: number;
}
