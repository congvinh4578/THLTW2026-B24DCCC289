import { useState } from 'react';
import {
  Home,
  KanbanSquare,
  ListTodo,
  PlusCircle,
  Settings,
  Moon,
  Sun,
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: 'dashboard' | 'kanban' | 'list') => void;
  onAddNewTask: () => void;
}

const menuItems = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    icon: <Home size={22} />,
  },
  {
    key: 'kanban',
    label: 'Kanban Board',
    icon: <KanbanSquare size={22} />,
  },
  {
    key: 'list',
    label: 'Danh sách Task',
    icon: <ListTodo size={22} />,
  },
];

export default function Sidebar({
  currentTab,
  setCurrentTab,
  onAddNewTask,
}: SidebarProps) {
  const [darkMode, setDarkMode] = useState(
    document.documentElement.classList.contains('dark'),
  );

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <div className="w-72 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 h-screen flex flex-col fixed left-0 top-0">
      <div className="px-6 py-8 flex items-center gap-3 border-b border-gray-100 dark:border-gray-800">
        <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl flex items-center justify-center">
          <span className="text-white font-bold text-2xl">T</span>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            TaskFlow
          </h1>
          <p className="text-xs text-gray-500">Quản lý công việc</p>
        </div>
      </div>

      <div className="px-6 pt-6">
        <button
          onClick={onAddNewTask}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3.5 px-4 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95"
        >
          <PlusCircle size={20} />
          Thêm công việc mới
        </button>
      </div>

      <div className="px-3 mt-8 flex-1">
        <p className="px-3 text-xs font-semibold text-gray-400 dark:text-gray-500 mb-4">
          CHÍNH
        </p>

        {menuItems.map((item) => (
          <div
            key={item.key}
            onClick={() => setCurrentTab(item.key as any)}
            className={`flex items-center gap-3 px-5 py-3.5 mx-2 rounded-2xl cursor-pointer mb-1 transition-all duration-200
              ${
                currentTab === item.key
                  ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 font-medium'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-[15px]">{item.label}</span>
          </div>
        ))}
      </div>

      <div className="p-6 border-t border-gray-100 dark:border-gray-800 mt-auto">
        <div className="flex items-center justify-between">
          <button
            onClick={toggleDarkMode}
            className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <button className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
            <Settings size={20} />
          </button>
        </div>

        <div className="text-center mt-6">
          <p className="text-xs text-gray-400">© 2026 TaskFlow • Hanoi</p>
        </div>
      </div>
    </div>
  );
}
