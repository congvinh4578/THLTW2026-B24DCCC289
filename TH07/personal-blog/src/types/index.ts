export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  image: string;
  tags: string[];
  status: 'draft' | 'published';
  createdAt: string;
  views: number;
}

export interface Tag {
  id: string;
  name: string;
  count: number;
}

export interface Author {
  name: string;
  avatar: string;
  bio: string;
  skills: string[];
  social: {
    twitter?: string;
    github?: string;
    linkedin?: string;
  };
}
