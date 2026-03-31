import { Link, useLocation } from 'react-router-dom';
import { Users, BookOpen, FileText, BarChart3, Home } from 'lucide-react';

export default function Sidebar() {
  const location = useLocation();

  const menu = [
    { to: '/', icon: Home, label: 'Dashboard' },
    { to: '/clubs', icon: BookOpen, label: 'Câu lạc bộ' },
    { to: '/registrations', icon: FileText, label: 'Đơn đăng ký' },
    { to: '/members', icon: Users, label: 'Thành viên' },
  ];

  return (
    <div className="w-64 bg-white border-r h-screen fixed flex flex-col shadow-xl">
      <div className="p-6 border-b">
        <h1 className="text-2xl font-bold text-blue-600">CLB Manager</h1>
      </div>
      <nav className="flex-1 p-4">
        {menu.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-1 transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
