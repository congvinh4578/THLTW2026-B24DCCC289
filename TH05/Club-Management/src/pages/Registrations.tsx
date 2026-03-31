import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import type { Registration } from '../types';
import { CheckCircle, XCircle, Eye, Trash2 } from 'lucide-react';
import Modal from '../components/Modal';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  type ColumnDef,
  type RowSelectionState,
  flexRender,
} from '@tanstack/react-table';

export default function Registrations() {
  const {
    registrations,
    approveRegistration,
    rejectRegistration,
    bulkApprove,
    bulkReject,
    clubs,
  } = useApp();
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [selectedRejectIds, setSelectedRejectIds] = useState<string[]>([]);
  const [rejectReason, setRejectReason] = useState('');
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [viewingReg, setViewingReg] = useState<Registration | null>(null);

  const columns = useMemo<ColumnDef<Registration>[]>(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <input
            type="checkbox"
            checked={table.getIsAllRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            checked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
          />
        ),
      },
      { accessorKey: 'fullName', header: 'Họ tên' },
      { accessorKey: 'email', header: 'Email' },
      { accessorKey: 'phone', header: 'SĐT' },
      { accessorKey: 'gender', header: 'Giới tính' },
      {
        accessorKey: 'clubId',
        header: 'Câu lạc bộ',
        cell: ({ getValue }) =>
          clubs.find((c) => c.id === getValue())?.name || 'Không xác định',
      },
      {
        accessorKey: 'status',
        header: 'Trạng thái',
        cell: ({ getValue }) => {
          const status = getValue() as string;
          const colors = {
            Pending: 'bg-amber-100 text-amber-700',
            Approved: 'bg-emerald-100 text-emerald-700',
            Rejected: 'bg-red-100 text-red-700',
          };
          return (
            <span
              className={`px-4 py-1 rounded-full text-xs font-medium ${colors[status as keyof typeof colors]}`}
            >
              {status}
            </span>
          );
        },
      },
      {
        id: 'actions',
        header: 'Thao tác',
        cell: ({ row }) => (
          <div className="flex gap-2">
            <button
              onClick={() => setViewingReg(row.original)}
              className="p-2 hover:bg-gray-100 rounded-xl"
            >
              <Eye size={18} />
            </button>
            {row.original.status === 'Pending' && (
              <>
                <button
                  onClick={() => approveRegistration(row.original.id)}
                  className="p-2 text-green-600 hover:bg-green-100 rounded-xl"
                >
                  <CheckCircle size={18} />
                </button>
                <button
                  onClick={() => {
                    setSelectedRejectIds([row.original.id]);
                    setIsRejectModalOpen(true);
                  }}
                  className="p-2 text-red-600 hover:bg-red-100 rounded-xl"
                >
                  <XCircle size={18} />
                </button>
              </>
            )}
          </div>
        ),
      },
    ],
    [clubs],
  );

  const table = useReactTable({
    data: registrations,
    columns,
    state: { rowSelection },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const selectedRows = Object.keys(rowSelection).filter(
    (key) => rowSelection[key],
  );

  const handleBulkReject = () => {
    if (!rejectReason.trim()) return alert('Vui lòng nhập lý do từ chối');
    bulkReject(
      selectedRejectIds.length ? selectedRejectIds : selectedRows,
      rejectReason,
    );
    setIsRejectModalOpen(false);
    setRejectReason('');
    setSelectedRejectIds([]);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Quản lý Đơn đăng ký</h1>
        {selectedRows.length > 0 && (
          <div className="flex gap-3">
            <button
              onClick={() => bulkApprove(selectedRows)}
              className="bg-emerald-600 text-white px-6 py-3 rounded-2xl flex items-center gap-2 hover:bg-emerald-700"
            >
              <CheckCircle size={20} /> Duyệt {selectedRows.length} đơn
            </button>
            <button
              onClick={() => {
                setSelectedRejectIds(selectedRows);
                setIsRejectModalOpen(true);
              }}
              className="bg-red-600 text-white px-6 py-3 rounded-2xl flex items-center gap-2 hover:bg-red-700"
            >
              <XCircle size={20} /> Từ chối {selectedRows.length} đơn
            </button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-3xl shadow-sm border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((header) => (
                  <th key={header.id} className="px-6 py-4 text-left">
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
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        title="Từ chối đơn đăng ký"
      >
        <textarea
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
          placeholder="Nhập lý do từ chối..."
          className="w-full h-32 border rounded-3xl p-4"
        />
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={() => setIsRejectModalOpen(false)}
            className="px-6 py-3 text-gray-600"
          >
            Hủy
          </button>
          <button
            onClick={handleBulkReject}
            className="px-6 py-3 bg-red-600 text-white rounded-2xl"
          >
            Xác nhận từ chối
          </button>
        </div>
      </Modal>

      {viewingReg && (
        <Modal
          isOpen={!!viewingReg}
          onClose={() => setViewingReg(null)}
          title="Chi tiết đơn đăng ký"
        >
          <div className="space-y-4">
            <p>
              <strong>Họ tên:</strong> {viewingReg.fullName}
            </p>
            <p>
              <strong>Email:</strong> {viewingReg.email}
            </p>
            <p>
              <strong>Lý do đăng ký:</strong> {viewingReg.reason}
            </p>
            <div>
              <strong>Lịch sử thao tác:</strong>
              <div className="mt-3 space-y-3">
                {viewingReg.history.map((h, i) => (
                  <div key={i} className="bg-gray-50 p-4 rounded-2xl text-sm">
                    <div className="font-medium">
                      {h.action} bởi {h.admin}
                    </div>
                    <div className="text-gray-500">{h.timestamp}</div>
                    {h.reason && (
                      <div className="mt-1 text-red-600">Lý do: {h.reason}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
