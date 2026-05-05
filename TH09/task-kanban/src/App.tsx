import { useState } from 'react';
import { TaskProvider, useTasks } from './context/TaskContext';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Kanban from './pages/Kanban';
import TaskList from './pages/TaskList';
import TaskModal from './components/TaskModal';
import type { Task } from './types';
import { message } from 'antd';
function AppContent() {
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'kanban' | 'list'>(
    'dashboard',
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const { addTask, updateTask } = useTasks();

  const handleSubmit = (values: any) => {
    if (editingTask) {
      updateTask(editingTask.id, values);
      message.success('✅ Đã cập nhật công việc thành công!');
    } else {
      addTask(values);
      message.success('✅ Đã thêm công việc mới thành công!');
    }

    setModalOpen(false);
    setEditingTask(null);
  };

  const renderPage = () => {
    switch (currentTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'kanban':
        return (
          <Kanban setModalOpen={setModalOpen} setEditingTask={setEditingTask} />
        );
      case 'list':
        return (
          <TaskList
            setModalOpen={setModalOpen}
            setEditingTask={setEditingTask}
          />
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onAddNewTask={() => {
          setEditingTask(null);
          setModalOpen(true);
        }}
      />

      <div className="flex-1 ml-72">
        <div className="h-16 border-b bg-white dark:bg-gray-900 px-8 flex items-center">
          <h2 className="text-2xl font-semibold capitalize tracking-tight">
            {currentTab === 'dashboard' && 'Dashboard'}
            {currentTab === 'kanban' && 'Kanban Board'}
            {currentTab === 'list' && 'Danh sách công việc'}
          </h2>
        </div>

        <main className="p-8">{renderPage()}</main>
      </div>

      <TaskModal
        open={modalOpen}
        task={editingTask}
        onClose={() => {
          setModalOpen(false);
          setEditingTask(null);
        }}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

function App() {
  return (
    <TaskProvider>
      <AppContent />
    </TaskProvider>
  );
}

export default App;
