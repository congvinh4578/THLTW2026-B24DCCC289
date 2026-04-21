import { useState, useEffect, useMemo } from 'react';
import { Search, Calendar, Eye } from 'lucide-react';
import PostCard from '../components/PostCard';
import { useBlogStore } from '../store/useBlogStore';

const POSTS_PER_PAGE = 9;

export default function Home() {
  const { posts, tags } = useBlogStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<
    'all' | 'published' | 'draft'
  >('all');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const filteredPosts = useMemo(() => {
    return posts
      .filter((post) => {
        const matchesSearch =
          post.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(debouncedSearch.toLowerCase());

        const matchesTag = !selectedTag || post.tags.includes(selectedTag);
        const matchesStatus =
          statusFilter === 'all' || post.status === statusFilter;

        return matchesSearch && matchesTag && matchesStatus;
      })
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  }, [posts, debouncedSearch, selectedTag, statusFilter]);

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const currentPosts = filteredPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE,
  );

  const handleTagClick = (tag: string) => {
    setSelectedTag(selectedTag === tag ? null : tag);
    setCurrentPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold tracking-tighter mb-4">
          Chào mừng đến với Blog của tôi
        </h1>
        <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
          Những suy nghĩ, kinh nghiệm và kiến thức về lập trình, công nghệ và
          cuộc sống.
        </p>
      </div>

      <div className="sticky top-20 z-40 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 mb-10 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Tìm kiếm bài viết..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-4 bg-zinc-100 dark:bg-zinc-900 rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-500 text-lg"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as 'all' | 'published' | 'draft');
              setCurrentPage(1);
            }}
            className="px-6 py-4 bg-zinc-100 dark:bg-zinc-900 rounded-2xl border border-transparent focus:border-violet-500 focus:outline-none"
          >
            <option value="all">Tất cả bài viết</option>
            <option value="published">Đã đăng</option>
            <option value="draft">Nháp</option>
          </select>
        </div>

        <div className="mt-6">
          <p className="text-sm text-zinc-500 mb-3 font-medium">Lọc theo thẻ</p>
          <div className="flex flex-wrap gap-3">
            {tags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => handleTagClick(tag.name)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedTag === tag.name
                    ? 'bg-violet-600 text-white scale-105'
                    : 'bg-zinc-100 dark:bg-zinc-900 hover:bg-violet-100 dark:hover:bg-violet-950'
                }`}
              >
                #{tag.name} ({tag.count})
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {currentPosts.length > 0 ? (
          currentPosts.map((post) => <PostCard key={post.id} post={post} />)
        ) : (
          <div className="col-span-3 text-center py-20 text-zinc-500">
            Không tìm thấy bài viết nào phù hợp.
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-16">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-6 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 disabled:opacity-50 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition"
          >
            Trước
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-12 h-12 rounded-2xl font-medium transition-all ${
                currentPage === page
                  ? 'bg-violet-600 text-white shadow-lg scale-110'
                  : 'hover:bg-zinc-100 dark:hover:bg-zinc-900'
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-6 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 disabled:opacity-50 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition"
          >
            Sau
          </button>
        </div>
      )}
    </div>
  );
}
