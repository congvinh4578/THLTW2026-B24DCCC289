import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Post, Tag } from '../types';

const initialPosts: Post[] = [
  {
    id: '1',
    title: 'Xây dựng Blog hiện đại với React & Tailwind 2026',
    slug: 'xay-dung-blog-hien-dai-react-tailwind',
    content: '# Xin chào thế giới!\n\nĐây là bài viết demo...',
    excerpt: 'Hướng dẫn xây dựng blog cá nhân hiện đại nhất 2026',
    image: 'https://picsum.photos/id/1015/1200/630',
    tags: ['react', 'tailwind', 'blog'],
    status: 'published',
    createdAt: '2026-04-20',
    views: 1243,
  },
];

export const useBlogStore = create<{
  posts: Post[];
  tags: Tag[];
  addPost: (post: Omit<Post, 'id' | 'views' | 'createdAt'>) => void;
  updatePost: (id: string, post: Partial<Post>) => void;
  deletePost: (id: string) => void;
  incrementView: (slug: string) => void;
  getPostBySlug: (slug: string) => Post | undefined;
  getRelatedPosts: (currentId: string, tags: string[]) => Post[];
}>()(
  persist(
    (set, get) => ({
      posts: initialPosts,
      tags: [
        { id: '1', name: 'react', count: 4 },
        { id: '2', name: 'tailwind', count: 3 },
        { id: '3', name: 'blog', count: 2 },
      ],

      addPost: (newPost) =>
        set((state) => ({
          posts: [
            ...state.posts,
            {
              ...newPost,
              id: Date.now().toString(),
              createdAt: new Date().toISOString().split('T')[0],
              views: 0,
            },
          ],
        })),

      updatePost: (id, updated) =>
        set((state) => ({
          posts: state.posts.map((p) =>
            p.id === id ? { ...p, ...updated } : p,
          ),
        })),

      deletePost: (id) =>
        set((state) => ({
          posts: state.posts.filter((p) => p.id !== id),
        })),

      incrementView: (slug) =>
        set((state) => ({
          posts: state.posts.map((p) =>
            p.slug === slug ? { ...p, views: p.views + 1 } : p,
          ),
        })),

      getPostBySlug: (slug) => get().posts.find((p) => p.slug === slug),

      getRelatedPosts: (currentId, tags) => {
        return get()
          .posts.filter(
            (p) =>
              p.id !== currentId &&
              p.status === 'published' &&
              p.tags.some((t) => tags.includes(t)),
          )
          .slice(0, 3);
      },
    }),
    { name: 'blog-storage' },
  ),
);
