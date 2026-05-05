import { useCallback, useState } from 'react';

import { SEED_POSTS } from '../data/seedPosts';
import type { Post } from '../types/feed.types';

const CURRENT_AUTHOR: Post['User'] = {
  id: 'u-self',
  firstName: 'You',
  lastName: '',
  profilePicture: null,
  userType: 'student',
};

/**
 * Local-first feed (matches client `useFeed` behavior when API is offline).
 */
export function useSocialFeed() {
  const [posts, setPosts] = useState<Post[]>(SEED_POSTS);
  const [savedPostIds, setSavedPostIds] = useState<Set<string>>(new Set());
  const [isLoading] = useState(false);
  const [isLoadingMore] = useState(false);
  const [error] = useState<string | null>(null);

  const handleLike = useCallback((postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        const was = p.isLikedByUser ?? false;
        return {
          ...p,
          isLikedByUser: !was,
          _count: { ...p._count, Like: p._count.Like + (was ? -1 : 1) },
        };
      }),
    );
  }, []);

  const handleCreate = useCallback(async (content: string, images?: string[]) => {
    const text = content.trim();
    if (!text && !(images?.length)) return;
    const newPost: Post = {
      id: `local-${Date.now()}`,
      content: text,
      images: images ?? [],
      tags: [],
      isRepost: false,
      originalPostId: null,
      repostComment: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      User: CURRENT_AUTHOR,
      _count: { Like: 0, Comment: 0, other_Post: 0 },
      isLikedByUser: false,
    };
    setPosts((prev) => [newPost, ...prev]);
  }, []);

  const handleDelete = useCallback((postId: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  }, []);

  const handleSave = useCallback((postId: string) => {
    setSavedPostIds((prev) => {
      const next = new Set(prev);
      if (next.has(postId)) next.delete(postId);
      else next.add(postId);
      return next;
    });
  }, []);

  const handleRepost = useCallback(async (_postId: string, _comment?: string) => {
    // Stub — web calls API; mobile can wire later
  }, []);

  const refresh = useCallback(async () => {
    setPosts(SEED_POSTS);
  }, []);

  const loadMore = useCallback(async () => {}, []);

  return {
    posts,
    savedPostIds,
    isLoading,
    isLoadingMore,
    error,
    refresh,
    loadMore,
    handleLike,
    handleCreate,
    handleDelete,
    handleSave,
    handleRepost,
  };
}
