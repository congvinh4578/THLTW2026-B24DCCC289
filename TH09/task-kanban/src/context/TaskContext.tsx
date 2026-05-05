import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import type { Task, Status } from '../types';

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTask: (id: string, newStatus: Status) => void;
}

const TaskContext = createContext<TaskContextType | null>(null);

const sampleTasks: Omit<Task, 'id' | 'createdAt'>[] = [
  {
    title: 'Hoàn thiện báo cáo tài chính Q1',
    description: 'Tổng hợp số liệu từ các bộ phận kinh doanh và kế toán',
    deadline: '2026-05-10T17:00:00.000Z',
    priority: 'Cao',
    status: 'Todo',
    tags: ['finance', 'report'],
  },
  {
    title: 'Thiết kế UI cho trang Landing Page',
    description: 'Sử dụng Figma, tập trung vào mobile-first',
    deadline: '2026-05-08T23:59:00.000Z',
    priority: 'Cao',
    status: 'InProgress',
    tags: ['design', 'uiux'],
  },
  {
    title: 'Học React Query và Tanstack Table',
    description: 'Áp dụng vào dự án TaskFlow',
    deadline: '2026-05-15T23:59:00.000Z',
    priority: 'Trung bình',
    status: 'Todo',
    tags: ['learning', 'react'],
  },
  {
    title: 'Đi tập gym 5 buổi/tuần',
    description: 'Focus Upper body hôm nay',
    deadline: '2026-05-06T18:00:00.000Z',
    priority: 'Trung bình',
    status: 'InProgress',
    tags: ['health'],
  },
  {
    title: 'Nộp hồ sơ xin visa Nhật Bản',
    description: 'Hoàn tất giấy tờ và booking lịch hẹn',
    deadline: '2026-05-05T23:59:00.000Z',
    priority: 'Cao',
    status: 'Done',
    tags: ['travel', 'admin'],
  },
  {
    title: 'Review code cho team backend',
    description: 'Kiểm tra API authentication',
    deadline: '2026-05-07T17:00:00.000Z',
    priority: 'Thấp',
    status: 'Todo',
    tags: ['code-review'],
  },
];

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('tasks');

    if (!saved || JSON.parse(saved).length === 0) {
      const initialTasks = sampleTasks.map((task) => ({
        ...task,
        id:
          'seed_' +
          Date.now().toString(36) +
          Math.random().toString(36).substr(2, 5),
        createdAt: new Date().toISOString(),
      }));

      localStorage.setItem('tasks', JSON.stringify(initialTasks));
      return initialTasks;
    }

    return JSON.parse(saved);
  });

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (newTask: Omit<Task, 'id' | 'createdAt'>) => {
    const task: Task = {
      ...newTask,
      id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [...prev, task]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const moveTask = (id: string, newStatus: Status) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t)),
    );
  };

  return (
    <TaskContext.Provider
      value={{ tasks, addTask, updateTask, deleteTask, moveTask }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) throw new Error('useTasks must be used within TaskProvider');
  return context;
};
