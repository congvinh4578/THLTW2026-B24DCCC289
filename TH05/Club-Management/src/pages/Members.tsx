import { useState, useMemo, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import Modal from '../components/Modal';
import {
  useReactTable,
  getCoreRowModel,
  type ColumnDef,
  type RowSelectionState,
  flexRender,
} from '@tanstack/react-table';
import type { Registration } from '../types';

export default function Members() {
  const { registrations, clubs, changeClubForMembers } = useApp();

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [isChangeModalOpen, setIsChangeModalOpen] = useState(false);
  const [newClubId, setNewClubId] = useState('');

  const members = useMemo(() => {
    return registrations.filter((r) => r.status === 'Approved');
  }, [registrations]);

  useEffect(() => {
    setRowSelection({});
  }, [registrations]);

  const columns = useMemo<ColumnDef<Registration>[]>(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <input
            type="checkbox"
            checked={table.getIsAllRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
            className="w-4 h-4"
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            checked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
            className="w-4 h-4"
          />
        ),
      },
      { accessorKey: 'fullName', header: 'Họ tên' },
      { accessorKey: 'email', header: 'Email' },
      { accessorKey: 'phone', header: 'SĐT' },
      {
        accessorKey: 'clubId',
        header: 'Câu lạc bộ',
        cell: ({ getValue }) => {
          const club = clubs.find((c) => c.id === getValue());
          return club ? club.name : 'Không xác định';
        },
      },
    ],
    [clubs],
  );

  const table = useReactTable({
    data: members,
    columns,
    state: { rowSelection },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id,
  });

  const selectedIds = Object.keys(rowSelection).filter(
    (key) => rowSelection[key],
  );

  const handleChangeClub = () => {
    if (!newClubId || selectedIds.length === 0) return;

    console.log('Members - Gửi yêu cầu chuyển CLB:', {
      selectedIds,
      newClubId,
    });

    changeClubForMembers(selectedIds, newClubId);

    setIsChangeModalOpen(false);
    setNewClubId('');
    setRowSelection({});
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Quản lý Thành viên</h1>
        {selectedIds.length > 0 && (
          <button
            onClick={() => setIsChangeModalOpen(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-2xl hover:bg-blue-700"
          >
            Chuyển CLB cho {selectedIds.length} thành viên
          </button>
        )}
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
        isOpen={isChangeModalOpen}
        onClose={() => setIsChangeModalOpen(false)}
        title="Chuyển câu lạc bộ"
        footer={
          <>
            <button
              onClick={() => setIsChangeModalOpen(false)}
              className="px-6 py-3 text-gray-600"
            >
              Hủy
            </button>
            <button
              onClick={handleChangeClub}
              disabled={!newClubId}
              className="px-6 py-3 bg-blue-600 text-white rounded-2xl disabled:bg-gray-300"
            >
              Xác nhận chuyển
            </button>
          </>
        }
      >
        <select
          value={newClubId}
          onChange={(e) => setNewClubId(e.target.value)}
          className="w-full border rounded-2xl px-4 py-3"
        >
          <option value="">-- Chọn câu lạc bộ --</option>
          {clubs.map((club) => (
            <option key={club.id} value={club.id}>
              {club.name}
            </option>
          ))}
        </select>
      </Modal>
    </div>
  );
}
