import { useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { useBlogStore } from '../store/useBlogStore';

export default function AdminTags() {
  const { tags } = useBlogStore();
  const [newTag, setNewTag] = useState('');

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-bold mb-10">Quản lý Thẻ</h1>

      <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 border">
        <div className="flex gap-4 mb-8">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Tên thẻ mới"
            className="flex-1 px-6 py-4 rounded-2xl border"
          />
          <button className="px-8 bg-violet-600 text-white rounded-2xl font-medium">
            Thêm thẻ
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tags.map((tag) => (
            <div
              key={tag.id}
              className="flex items-center justify-between bg-zinc-50 dark:bg-zinc-800 p-6 rounded-2xl"
            >
              <div>
                <span className="font-semibold text-lg">#{tag.name}</span>
                <p className="text-sm text-zinc-500">{tag.count} bài viết</p>
              </div>
              <div className="flex gap-3">
                <button className="p-3 hover:bg-zinc-200 rounded-xl">
                  <Edit2 size={20} />
                </button>
                <button className="p-3 hover:bg-red-100 text-red-600 rounded-xl">
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
