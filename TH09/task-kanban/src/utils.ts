import dayjs from 'dayjs';
import type { Task, Status, Priority } from './types';

export const formatDate = (date: string): string => {
  return dayjs(date).format('DD/MM/YYYY');
};

export const formatDateWithTime = (date: string): string => {
  return dayjs(date).format('DD/MM/YYYY HH:mm');
};

export const isOverdue = (task: Task): boolean => {
  return dayjs(task.deadline).isBefore(dayjs()) && task.status !== 'Done';
};

export const getPriorityColor = (priority: Priority) => {
  switch (priority) {
    case 'Cao':
      return {
        bg: 'bg-red-100 dark:bg-red-900/30',
        text: 'text-red-700 dark:text-red-400',
        border: 'border-red-500',
      };
    case 'Trung bình':
      return {
        bg: 'bg-amber-100 dark:bg-amber-900/30',
        text: 'text-amber-700 dark:text-amber-400',
        border: 'border-amber-500',
      };
    case 'Thấp':
      return {
        bg: 'bg-green-100 dark:bg-green-900/30',
        text: 'text-green-700 dark:text-green-400',
        border: 'border-green-500',
      };
    default:
      return {
        bg: 'bg-gray-100',
        text: 'text-gray-700',
        border: 'border-gray-500',
      };
  }
};

export const getStatusColor = (status: Status) => {
  switch (status) {
    case 'Todo':
      return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
    case 'InProgress':
      return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
    case 'Done':
      return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

export const getStats = (tasks: Task[]) => {
  const total = tasks.length;
  const done = tasks.filter((t) => t.status === 'Done').length;
  const overdue = tasks.filter((t) => isOverdue(t)).length;
  const inProgress = tasks.filter((t) => t.status === 'InProgress').length;
  const todo = tasks.filter((t) => t.status === 'Todo').length;

  const completionRate = total === 0 ? 0 : Math.round((done / total) * 100);

  return {
    total,
    done,
    overdue,
    inProgress,
    todo,
    completionRate,
  };
};

export const filterTasks = (
  tasks: Task[],
  searchTerm: string,
  statusFilter: Status | 'All',
) => {
  return tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase()),
      );

    const matchesStatus =
      statusFilter === 'All' || task.status === statusFilter;

    return matchesSearch && matchesStatus;
  });
};

export const sortTasksByDeadline = (
  tasks: Task[],
  order: 'asc' | 'desc' = 'asc',
) => {
  return [...tasks].sort((a, b) => {
    const dateA = dayjs(a.deadline);
    const dateB = dayjs(b.deadline);
    return order === 'asc' ? dateA.diff(dateB) : dateB.diff(dateA);
  });
};

export default {
  formatDate,
  formatDateWithTime,
  isOverdue,
  getPriorityColor,
  getStatusColor,
  getStats,
  filterTasks,
  sortTasksByDeadline,
};
