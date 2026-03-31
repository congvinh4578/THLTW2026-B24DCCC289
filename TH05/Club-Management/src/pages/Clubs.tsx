import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import type { Club } from '../types';
import { Edit, Trash2, Users, Plus } from 'lucide-react';
import Modal from '../components/Modal';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  type ColumnDef,
} from '@tanstack/react-table';

export default function Clubs() {
  const { clubs, addClub, updateClub, deleteClub } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClub, setEditingClub] = useState<Club | null>(null);
  const [form, setForm] = useState<Partial<Club>>({});

  const columns = useMemo<ColumnDef<Club>[]>(
    () => [
      {
        accessorKey: 'avatar',
        header: 'Ảnh',
        cell: ({ getValue }) => (
          <img
            src={getValue() as string}
            className="w-10 h-10 rounded-full object-cover"
          />
        ),
      },
      { accessorKey: 'name', header: 'Tên câu lạc bộ' },
      { accessorKey: 'foundingDate', header: 'Ngày thành lập' },
      {
        accessorKey: 'description',
        header: 'Mô tả',
        cell: ({ getValue }) => (
          <div
            dangerouslySetInnerHTML={{
              __html: (getValue() as string).slice(0, 80) + '...',
            }}
          />
        ),
      },
      { accessorKey: 'leader', header: 'Chủ nhiệm' },
      {
        accessorKey: 'active',
        header: 'Hoạt động',
        cell: ({ getValue }) => (
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${getValue() ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
          >
            {getValue() ? 'Có' : 'Không'}
          </span>
        ),
      },
      {
        id: 'actions',
        header: 'Thao tác',
        cell: ({ row }) => (
          <div className="flex gap-2">
            <button
              onClick={() => handleEdit(row.original)}
              className="p-2 text-blue-600 hover:bg-blue-100 rounded-xl"
            >
              <Edit size={18} />
            </button>
            <button
              onClick={() => deleteClub(row.original.id)}
              className="p-2 text-red-600 hover:bg-red-100 rounded-xl"
            >
              <Trash2 size={18} />
            </button>
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-xl">
              <Users size={18} />
            </button>
          </div>
        ),
      },
    ],
    [],
  );

  const table = useReactTable({
    data: clubs,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const handleEdit = (club: Club) => {
    setEditingClub(club);
    setForm(club);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!form.name || !form.leader) return alert('Vui lòng nhập đủ thông tin');

    const newClub: Club = {
      id: editingClub?.id || Date.now().toString(),
      avatar: form.avatar || 'https://picsum.photos/id/1005/128/128',
      name: form.name,
      foundingDate: form.foundingDate || new Date().toISOString().split('T')[0],
      description: form.description || '',
      leader: form.leader,
      active: form.active ?? true,
    };

    if (editingClub) {
      updateClub(newClub);
    } else {
      addClub(newClub);
    }

    setIsModalOpen(false);
    setForm({});
    setEditingClub(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Quản lý Câu lạc bộ</h1>
        <button
          onClick={() => {
            setEditingClub(null);
            setForm({});
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-2xl hover:bg-blue-700 transition"
        >
          <Plus size={20} /> Thêm CLB mới
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-4 text-left text-sm font-medium text-gray-500"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-b hover:bg-gray-50">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-6 py-4">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingClub ? 'Chỉnh sửa CLB' : 'Thêm câu lạc bộ mới'}
        footer={
          <>
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-6 py-3 text-gray-600 hover:bg-gray-100 rounded-2xl"
            >
              Hủy
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700"
            >
              Lưu
            </button>
          </>
        }
      >
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Tên câu lạc bộ
            </label>
            <input
              type="text"
              value={form.name || ''}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border rounded-2xl px-4 py-3 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Chủ nhiệm</label>
            <input
              type="text"
              value={form.leader || ''}
              onChange={(e) => setForm({ ...form, leader: e.target.value })}
              className="w-full border rounded-2xl px-4 py-3 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Ngày thành lập
            </label>
            <input
              type="date"
              value={form.foundingDate || ''}
              onChange={(e) =>
                setForm({ ...form, foundingDate: e.target.value })
              }
              className="w-full border rounded-2xl px-4 py-3"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Ảnh đại diện (URL)
            </label>
            <input
              type="text"
              value={form.avatar || ''}
              onChange={(e) => setForm({ ...form, avatar: e.target.value })}
              className="w-full border rounded-2xl px-4 py-3"
            />
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium mb-2">Mô tả (HTML)</label>
          <textarea
            value={form.description || ''}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={5}
            className="w-full border rounded-3xl px-4 py-3 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="mt-6 flex items-center gap-3">
          <input
            type="checkbox"
            checked={form.active ?? true}
            onChange={(e) => setForm({ ...form, active: e.target.checked })}
          />
          <span>CLB đang hoạt động</span>
        </div>
      </Modal>
    </div>
  );
}
