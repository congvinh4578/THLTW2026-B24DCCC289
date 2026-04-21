import { useState } from 'react';
import { Plus, Edit2, Trash2, Eye } from 'lucide-react';
import { useBlogStore } from '../store/useBlogStore';
import type { Post } from '../types';
import { format } from 'date-fns';

export default function AdminPosts() {
  const { posts, addPost, updatePost, deletePost } = useBlogStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [searchAdmin, setSearchAdmin] = useState('');
  const [statusFilterAdmin, setStatusFilterAdmin] = useState<
    'all' | 'published' | 'draft'
  >('all');

  const [postToDelete, setPostToDelete] = useState<Post | null>(null);

  const filteredAdminPosts = posts
    .filter(
      (p) =>
        p.title.toLowerCase().includes(searchAdmin.toLowerCase()) &&
        (statusFilterAdmin === 'all' || p.status === statusFilterAdmin),
    )
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const postData = {
      title: formData.get('title') as string,
      slug: formData.get('slug') as string,
      content: formData.get('content') as string,
      excerpt: formData.get('excerpt') as string,
      image: formData.get('image') as string,
      tags: (formData.get('tags') as string).split(',').map((t) => t.trim()),
      status: formData.get('status') as 'draft' | 'published',
    };

    if (editingPost) {
      updatePost(editingPost.id, postData);
    } else {
      addPost(postData);
    }

    setIsModalOpen(false);
    setEditingPost(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold">Quản lý Bài Viết</h1>
        <button
          onClick={() => {
            setPostToDelete(null);
            setEditingPost(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-3 bg-violet-600 hover:bg-violet-700 text-white px-6 py-4 rounded-2xl font-medium transition"
        >
          <Plus size={22} /> Thêm bài viết mới
        </button>
      </div>

      <div className="flex gap-4 mb-8">
        <input
          type="text"
          placeholder="Tìm theo tiêu đề..."
          value={searchAdmin}
          onChange={(e) => setSearchAdmin(e.target.value)}
          className="flex-1 px-6 py-4 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800"
        />
        <select
          value={statusFilterAdmin}
          onChange={(e) => setStatusFilterAdmin(e.target.value as any)}
          className="px-6 py-4 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800"
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="published">Đã đăng</option>
          <option value="draft">Nháp</option>
        </select>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-100 dark:border-zinc-800">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-200 dark:border-zinc-800">
              <th className="text-left p-6 font-medium">Tiêu đề</th>
              <th className="text-left p-6 font-medium">Trạng thái</th>
              <th className="text-left p-6 font-medium">Thẻ</th>
              <th className="text-left p-6 font-medium">Lượt xem</th>
              <th className="text-left p-6 font-medium">Ngày tạo</th>
              <th className="w-32"></th>
            </tr>
          </thead>
          <tbody>
            {filteredAdminPosts.map((post) => (
              <tr
                key={post.id}
                className="border-b border-zinc-100 dark:border-zinc-800 last:border-none hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
              >
                <td className="p-6 font-medium">{post.title}</td>
                <td className="p-6">
                  <span
                    className={`inline-block px-4 py-1 rounded-full text-xs font-medium ${
                      post.status === 'published'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900'
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-900'
                    }`}
                  >
                    {post.status === 'published' ? 'Đã đăng' : 'Nháp'}
                  </span>
                </td>
                <td className="p-6">
                  <div className="flex gap-2">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="p-6 text-zinc-500">{post.views}</td>
                <td className="p-6 text-zinc-500">
                  {format(new Date(post.createdAt), 'dd/MM/yyyy')}
                </td>
                <td className="p-6">
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setEditingPost(post);
                        setIsModalOpen(false);
                      }}
                      className="p-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition"
                    >
                      <Edit2 size={18} />
                    </button>

                    <button
                      onClick={() => setPostToDelete(post)}
                      className="p-3 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 rounded-xl transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-6">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-auto">
            <form onSubmit={handleSave} className="p-8 space-y-6">
              <h2 className="text-3xl font-bold mb-6">
                {editingPost ? 'Chỉnh sửa' : 'Bài viết mới'}
              </h2>

              <input
                name="title"
                defaultValue={editingPost?.title}
                required
                className="w-full p-4 rounded-2xl border"
              />
              <input
                name="slug"
                defaultValue={editingPost?.slug}
                required
                className="w-full p-4 rounded-2xl border"
              />
              <input
                name="image"
                defaultValue={editingPost?.image}
                required
                className="w-full p-4 rounded-2xl border"
              />
              <input
                name="excerpt"
                defaultValue={editingPost?.excerpt}
                required
                className="w-full p-4 rounded-2xl border"
              />
              <input
                name="tags"
                defaultValue={editingPost?.tags.join(', ')}
                required
                className="w-full p-4 rounded-2xl border"
              />

              <select
                name="status"
                defaultValue={editingPost?.status}
                className="w-full p-4 rounded-2xl border"
              >
                <option value="draft">Nháp</option>
                <option value="published">Đã đăng</option>
              </select>

              <textarea
                name="content"
                defaultValue={editingPost?.content}
                required
                rows={12}
                className="w-full p-4 rounded-3xl border font-mono text-sm"
              />

              <div className="flex gap-4 pt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-4 rounded-2xl border"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 py-4 bg-violet-600 text-white rounded-2xl font-medium"
                >
                  Lưu bài viết
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {postToDelete && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Xác nhận xoá</h2>
            <p className="mb-6">
              Bạn có chắc muốn xoá:
              <b> "{postToDelete.title}"</b>?
            </p>

            <div className="flex gap-4">
              <button
                onClick={() => setPostToDelete(null)}
                className="flex-1 border py-3 rounded-xl"
              >
                Huỷ
              </button>

              <button
                onClick={() => {
                  deletePost(postToDelete.id);
                  setPostToDelete(null);
                }}
                className="flex-1 bg-red-600 text-white py-3 rounded-xl"
              >
                Xoá
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
