import { Home, BookOpen, User, Settings } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800">
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-2xl flex items-center justify-center">
            <span className="text-white font-bold text-xl">V</span>
          </div>
          <span className="font-semibold text-2xl tracking-tight">
            Vinh Blog
          </span>
        </Link>

        <div className="flex items-center gap-8 text-sm font-medium">
          <Link
            to="/"
            className={`hover:text-violet-600 transition-colors ${location.pathname === '/' ? 'text-violet-600' : ''}`}
          >
            Trang chủ
          </Link>
          <Link
            to="/about"
            className={`hover:text-violet-600 transition-colors ${location.pathname === '/about' ? 'text-violet-600' : ''}`}
          >
            Giới thiệu
          </Link>
          <Link
            to="/admin/posts"
            className="flex items-center gap-2 hover:text-violet-600 transition-colors"
          >
            <Settings size={18} />
            Quản lý
          </Link>
        </div>

        <div className="w-9 h-9 rounded-full bg-zinc-200 dark:bg-zinc-800" />
      </div>
    </nav>
  );
}
