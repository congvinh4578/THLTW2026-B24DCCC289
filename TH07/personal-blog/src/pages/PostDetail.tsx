import { useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Eye, Clock } from 'lucide-react';
import MarkdownRenderer from '../components/MarkdownRenderer';
import PostCard from '../components/PostCard';
import { useBlogStore } from '../store/useBlogStore';
import { format } from 'date-fns';

export default function PostDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const { getPostBySlug, incrementView, getRelatedPosts, posts } =
    useBlogStore();

  const post = getPostBySlug(slug || '');

  useEffect(() => {
    if (!slug) return;

    const viewed = sessionStorage.getItem(`viewed-${slug}`);
    if (!viewed) {
      incrementView(slug);
      sessionStorage.setItem(`viewed-${slug}`, 'true');
    }
  }, [slug]);

  const relatedPosts = useMemo(() => {
    if (!post) return [];
    return getRelatedPosts(post.id, post.tags);
  }, [post, getRelatedPosts]);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Bài viết không tồn tại</h2>
          <Link to="/" className="text-violet-600 hover:underline">
            ← Quay về trang chủ
          </Link>
        </div>
      </div>
    );
  }

  const readingTime = Math.ceil(post.content.split(' ').length / 200);

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white mb-8 transition"
      >
        <ArrowLeft size={20} />
        <span>Quay lại danh sách</span>
      </button>

      <div className="relative h-[420px] rounded-3xl overflow-hidden mb-10 shadow-2xl">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

        <div className="absolute bottom-0 left-0 p-10 text-white">
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-4 py-1.5 bg-white/20 backdrop-blur-md text-xs font-medium rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
          <h1 className="text-5xl font-bold leading-tight tracking-tighter">
            {post.title}
          </h1>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-8 mb-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-2xl" />
          <div>
            <div className="font-semibold">Vinh</div>
            <div className="text-sm text-zinc-500">Tác giả</div>
          </div>
        </div>

        <div className="flex items-center gap-8 text-sm">
          <div className="flex items-center gap-2">
            <Calendar size={18} />
            <span>{format(new Date(post.createdAt), 'dd MMMM, yyyy')}</span>
          </div>
          <div className="flex items-center gap-2">
            <Eye size={18} />
            <span>{post.views} lượt xem</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={18} />
            <span>{readingTime} phút đọc</span>
          </div>
        </div>
      </div>

      <article className="mb-20">
        <MarkdownRenderer content={post.content} />
      </article>

      <div className="flex flex-wrap gap-3 pb-12 border-b border-zinc-200 dark:border-zinc-800">
        {post.tags.map((tag) => (
          <Link
            key={tag}
            to={`/?tag=${tag}`}
            className="px-6 py-3 bg-zinc-100 dark:bg-zinc-900 hover:bg-violet-100 dark:hover:bg-violet-950 rounded-2xl text-sm font-medium transition"
          >
            #{tag}
          </Link>
        ))}
      </div>

      {relatedPosts.length > 0 && (
        <div className="mt-16">
          <h3 className="text-2xl font-semibold mb-8 flex items-center gap-3">
            Bài viết liên quan
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {relatedPosts.map((related) => (
              <PostCard key={related.id} post={related} />
            ))}
          </div>
        </div>
      )}

      <div className="mt-20 pt-10 border-t border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-medium hover:text-violet-600 transition"
        >
          ← Bài trước
        </button>
        <Link
          to="/"
          className="px-8 py-4 bg-zinc-900 dark:bg-white dark:text-zinc-900 text-white rounded-2xl font-medium hover:bg-violet-600 transition"
        >
          Xem tất cả bài viết
        </Link>
      </div>
    </div>
  );
}
