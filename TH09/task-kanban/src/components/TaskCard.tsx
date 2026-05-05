import { Calendar, Flag, Edit, Trash2 } from 'lucide-react';
import type { Task } from '../types';
import dayjs from 'dayjs';

interface Props {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const priorityStyles = {
  Cao: 'bg-red-100 text-red-700',
  'Trung bình': 'bg-amber-100 text-amber-700',
  Thấp: 'bg-green-100 text-green-700',
};

export default function TaskCard({ task, onEdit, onDelete }: Props) {
  const isOverdue =
    dayjs(task.deadline).isBefore(dayjs()) && task.status !== 'Done';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 hover:shadow-lg transition-all duration-200">
      <div className="flex justify-between">
        <h4 className="font-semibold text-lg leading-tight pr-8">
          {task.title}
        </h4>
        <div className="flex gap-1">
          <button
            onClick={() => onEdit(task)}
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-1.5 hover:bg-red-100 text-red-500 rounded-lg"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {task.description && (
        <p className="text-gray-600 dark:text-gray-400 text-sm mt-3 line-clamp-2">
          {task.description}
        </p>
      )}

      <div className="flex flex-wrap gap-2 mt-4">
        <div
          className={`text-xs px-3 py-1 rounded-full flex items-center gap-1 ${priorityStyles[task.priority]}`}
        >
          <Flag size={15} /> {task.priority}
        </div>
        {task.tags.map((tag) => (
          <div
            key={tag}
            className="text-xs bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full"
          >
            #{tag}
          </div>
        ))}
      </div>

      <div
        className={`mt-5 flex items-center gap-2 text-sm ${isOverdue ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}
      >
        <Calendar size={17} />
        <span>{dayjs(task.deadline).format('DD/MM/YYYY')}</span>
        {isOverdue && <span className="font-medium">(Quá hạn)</span>}
      </div>
    </div>
  );
}
