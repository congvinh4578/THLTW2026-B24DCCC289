import { Home, BookOpen, PlusCircle, BarChart3 } from 'lucide-react';
import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  return (
    <div className="w-80 h-screen fixed bg-gradient-to-b from-slate-900 to-slate-800 text-white shadow-2xl flex flex-col">
      {' '}
      {/* Tăng width từ 72 lên 80 */}
      <div className="p-8">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-3xl flex items-center justify-center">
            <BookOpen size={28} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">EduManager</h1>
        </div>

        <nav className="space-y-2">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center gap-4 px-6 py-4 rounded-3xl text-[17px] font-medium transition-all ${isActive ? 'bg-white/10 text-white' : 'hover:bg-white/10'}`
            }
          >
            <Home size={24} />
            Dashboard
          </NavLink>

          <NavLink
            to="/courses"
            className={({ isActive }) =>
              `flex items-center gap-4 px-6 py-4 rounded-3xl text-[17px] font-medium transition-all ${isActive ? 'bg-white/10 text-white' : 'hover:bg-white/10'}`
            }
          >
            <BookOpen size={24} />
            <span>Danh sách khóa học</span>
          </NavLink>

          <NavLink
            to="/courses/new"
            className={({ isActive }) =>
              `flex items-center gap-4 px-6 py-4 rounded-3xl text-[17px] font-medium transition-all ${isActive ? 'bg-white/10 text-white' : 'hover:bg-white/10'}`
            }
          >
            <PlusCircle size={24} />
            Thêm khóa học mới
          </NavLink>

          <NavLink
            to="/statistics"
            className={({ isActive }) =>
              `flex items-center gap-4 px-6 py-4 rounded-3xl text-[17px] font-medium transition-all ${isActive ? 'bg-white/10 text-white' : 'hover:bg-white/10'}`
            }
          >
            <BarChart3 size={24} />
            Thống kê
          </NavLink>
        </nav>
      </div>
      <div className="mt-auto p-8 text-xs text-slate-400">
        © 2026 EduManager
      </div>
    </div>
  );
}
