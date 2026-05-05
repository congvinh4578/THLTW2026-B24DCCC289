import { useTasks } from '../context/TaskContext';
import { Card } from 'antd';
import dayjs from 'dayjs';
import { CheckCircle, Clock, AlertTriangle, List } from 'lucide-react';

export default function Dashboard() {
  const { tasks } = useTasks();

  const total = tasks.length;
  const done = tasks.filter((t) => t.status === 'Done').length;
  const overdue = tasks.filter(
    (t) => dayjs(t.deadline).isBefore(dayjs()) && t.status !== 'Done',
  ).length;
  const inProgress = tasks.filter((t) => t.status === 'InProgress').length;

  const completionRate = total === 0 ? 0 : Math.round((done / total) * 100);

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-10">
        Chào mừng trở lại! Đây là tình hình công việc hôm nay.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-blue-100 rounded-2xl">
              <List className="text-blue-600" size={32} />
            </div>
            <div>
              <p className="text-4xl font-bold">{total}</p>
              <p className="text-gray-500">Tổng công việc</p>
            </div>
          </div>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-emerald-100 rounded-2xl">
              <CheckCircle className="text-emerald-600" size={32} />
            </div>
            <div>
              <p className="text-4xl font-bold text-emerald-600">{done}</p>
              <p className="text-gray-500">Đã hoàn thành</p>
            </div>
          </div>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-amber-100 rounded-2xl">
              <Clock className="text-amber-600" size={32} />
            </div>
            <div>
              <p className="text-4xl font-bold text-amber-600">{inProgress}</p>
              <p className="text-gray-500">Đang thực hiện</p>
            </div>
          </div>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-red-100 rounded-2xl">
              <AlertTriangle className="text-red-600" size={32} />
            </div>
            <div>
              <p className="text-4xl font-bold text-red-600">{overdue}</p>
              <p className="text-gray-500">Quá hạn</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="mt-10 bg-white dark:bg-gray-800 rounded-3xl p-8">
        <h2 className="text-2xl font-semibold mb-6">Tỷ lệ hoàn thành</h2>
        <div className="text-7xl font-bold text-indigo-600">
          {completionRate}%
        </div>
      </div>
    </div>
  );
}
