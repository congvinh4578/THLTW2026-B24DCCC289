import { Calendar, Eye, User } from 'lucide-react';
import type { Post } from '../types';
import { Link } from 'react-router-dom';

export default function PostCard({ post }: { post: Post }) {
  return (
    <Link to={`/blog/${post.slug}`} className="group">
      <div className="bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-zinc-100 dark:border-zinc-800">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="p-6">
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 text-xs font-medium bg-violet-100 dark:bg-violet-900 text-violet-700 dark:text-violet-300 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>

          <h3 className="text-2xl font-semibold leading-tight mb-3 line-clamp-2 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
            {post.title}
          </h3>

          <p className="text-zinc-600 dark:text-zinc-400 line-clamp-3 text-sm mb-6">
            {post.excerpt}
          </p>

          <div className="flex items-center justify-between text-sm text-zinc-500">
            <div className="flex items-center gap-2">
              <User size={16} />
              <span>Vinh</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Calendar size={16} />
                <span>{post.createdAt}</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye size={16} />
                <span>{post.views}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
