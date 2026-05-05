import { useState } from 'react';
import { Layout as AntLayout, Button } from 'antd';
import { Menu, X, Home, KanbanIcon, List, Moon, Sun } from 'lucide-react';
import { useTasks } from '../context/TaskContext';

const { Sider, Content } = AntLayout;

export default function Layout({ children, currentTab, setCurrentTab }: any) {
  const [collapsed, setCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const { tasks } = useTasks();

  const toggleDark = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const menu = [
    { key: 'dashboard', label: 'Dashboard', icon: <Home size={20} /> },
    { key: 'kanban', label: 'Kanban Board', icon: <KanbanIcon size={20} /> },
    { key: 'list', label: 'Danh sách task', icon: <List size={20} /> },
  ];

  return (
    <AntLayout className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Sider
        collapsed={collapsed}
        className="bg-white dark:bg-gray-900 border-r"
      >
        <div className="p-6 flex items-center gap-3">
          <div className="w-9 h-9 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold">
            T
          </div>
          {!collapsed && <span className="font-bold text-2xl">TaskFlow</span>}
        </div>

        <div className="px-4 mt-6">
          {menu.map((item) => (
            <div
              key={item.key}
              onClick={() => setCurrentTab(item.key)}
              className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl cursor-pointer mb-1 transition-all ${currentTab === item.key ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
            >
              {item.icon}
              {!collapsed && <span>{item.label}</span>}
            </div>
          ))}
        </div>
      </Sider>

      <AntLayout>
        <div className="bg-white dark:bg-gray-900 border-b px-8 py-5 flex justify-between items-center">
          <Button type="text" onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? <Menu size={24} /> : <X size={24} />}
          </Button>

          <div className="flex items-center gap-4">
            <Button onClick={toggleDark} icon={darkMode ? <Sun /> : <Moon />} />
            <div className="text-sm text-gray-500">
              {new Date().toLocaleDateString('vi-VN', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
              })}
            </div>
          </div>
        </div>

        <Content className="overflow-auto">{children}</Content>
      </AntLayout>
    </AntLayout>
  );
}
