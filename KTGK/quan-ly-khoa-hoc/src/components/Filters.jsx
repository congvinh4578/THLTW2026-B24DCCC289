import { Search, ArrowUpDown } from 'lucide-react';

export default function Filters({
  searchTerm,
  setSearchTerm,
  filterLecturer,
  setFilterLecturer,
  filterStatus,
  setFilterStatus,
  sortDirection,
  toggleSort,
  lecturers,
  statuses,
}) {
  return (
    <div className="bg-white p-8 rounded-3xl shadow-xl mb-10 flex flex-wrap gap-6 items-end">
      <div className="flex-1 min-w-[300px]">
        <label className="block text-sm font-semibold text-gray-600 mb-2">
          🔍 Tìm kiếm khóa học
        </label>
        <div className="relative">
          <Search className="absolute left-5 top-4 text-gray-400" size={22} />
          <input
            type="text"
            placeholder="Nhập tên khóa học..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-14 pr-6 py-4 border border-gray-200 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
          />
        </div>
      </div>
      <div className="flex-1 min-w-[220px]">
        <label className="block text-sm font-semibold text-gray-600 mb-2">
          👨‍🏫 Giảng viên
        </label>
        <select
          value={filterLecturer}
          onChange={(e) => setFilterLecturer(e.target.value)}
          className="w-full px-6 py-4 border border-gray-200 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Tất cả giảng viên</option>
          {lecturers.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
      </div>
      <div className="flex-1 min-w-[220px]">
        <label className="block text-sm font-semibold text-gray-600 mb-2">
          📊 Trạng thái
        </label>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="w-full px-6 py-4 border border-gray-200 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Tất cả trạng thái</option>
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
      <button
        onClick={toggleSort}
        className="px-8 py-4 bg-gray-900 hover:bg-black text-white rounded-3xl flex items-center gap-3 font-medium transition-all active:scale-95"
      >
        <ArrowUpDown size={20} />
        Sắp xếp SLHV {sortDirection === 'desc' ? '↓' : '↑'}
      </button>
    </div>
  );
}
