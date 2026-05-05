import { useState, useMemo } from 'react';
import { Table, Input, Select, Tag, Button, Space, message, Modal } from 'antd';
import { Edit, Trash2, Calendar } from 'lucide-react';
import dayjs from 'dayjs';
import { useTasks } from '../context/TaskContext';
import type { Task } from '../types';
import { isOverdue, getPriorityColor, formatDate } from '../utils';
import { SearchOutlined } from '@ant-design/icons';
const { Option } = Select;

interface TaskListProps {
  setModalOpen: (open: boolean) => void;
  setEditingTask: (task: Task | null) => void;
}

export default function TaskList({
  setModalOpen,
  setEditingTask,
}: TaskListProps) {
  const { tasks, deleteTask } = useTasks();
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<
    'All' | 'Todo' | 'InProgress' | 'Done'
  >('All');
  const [priorityFilter, setPriorityFilter] = useState<
    'All' | 'Cao' | 'Trung bình' | 'Thấp'
  >('All');

  const handleDelete = (task: Task) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: `Bạn có chắc muốn xóa task "${task.title}"?`,
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk() {
        deleteTask(task.id);
        message.success(`Đã xóa task: ${task.title}`, 2.5);
      },
    });
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchText.toLowerCase()) ||
        task.description.toLowerCase().includes(searchText.toLowerCase()) ||
        task.tags.some((tag) =>
          tag.toLowerCase().includes(searchText.toLowerCase()),
        );

      const matchesStatus =
        statusFilter === 'All' || task.status === statusFilter;
      const matchesPriority =
        priorityFilter === 'All' || task.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tasks, searchText, statusFilter, priorityFilter]);

  const columns = [
    {
      title: 'Công việc',
      dataIndex: 'title',
      key: 'title',
      render: (text: string, record: Task) => (
        <div>
          <div className="font-medium">{text}</div>
          {record.description && (
            <div className="text-sm text-gray-500 line-clamp-1">
              {record.description}
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Hạn chót',
      dataIndex: 'deadline',
      key: 'deadline',
      sorter: (a: Task, b: Task) =>
        dayjs(a.deadline).unix() - dayjs(b.deadline).unix(),
      render: (deadline: string, record: Task) => {
        const overdue = isOverdue(record);
        return (
          <div
            className={`flex items-center gap-2 ${overdue ? 'text-red-600' : ''}`}
          >
            <Calendar size={16} />
            {formatDate(deadline)}
            {overdue && <span className="text-xs ml-1">(Quá hạn)</span>}
          </div>
        );
      },
    },
    {
      title: 'Ưu tiên',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority: string) => {
        const colors = getPriorityColor(priority as any);
        return (
          <Tag className={`${colors.bg} ${colors.text} border-0`}>
            {priority}
          </Tag>
        );
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colorMap: any = {
          Todo: 'blue',
          InProgress: 'orange',
          Done: 'green',
        };
        const label =
          status === 'Todo'
            ? 'Cần làm'
            : status === 'InProgress'
              ? 'Đang làm'
              : 'Hoàn thành';
        return <Tag color={colorMap[status]}>{label}</Tag>;
      },
    },
    {
      title: 'Tags',
      dataIndex: 'tags',
      key: 'tags',
      render: (tags: string[]) => (
        <div className="flex flex-wrap gap-1">
          {tags.map((tag) => (
            <Tag key={tag}>#{tag}</Tag>
          ))}
        </div>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: Task) => (
        <Space>
          <Button
            type="text"
            icon={<Edit size={18} />}
            onClick={() => {
              setEditingTask(record);
              setModalOpen(true);
            }}
          />
          <Button
            type="text"
            danger
            icon={<Trash2 size={18} />}
            onClick={() => handleDelete(record)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold">Danh sách công việc</h1>

        <div className="flex flex-wrap gap-3">
          <Input
            placeholder="Tìm kiếm task..."
            prefix={<SearchOutlined />}
            className="w-80"
            allowClear
            onChange={(e) => setSearchText(e.target.value)}
          />

          <Select
            className="w-40"
            value={statusFilter}
            onChange={(v: any) => setStatusFilter(v)}
          >
            <Option value="All">Tất cả trạng thái</Option>
            <Option value="Todo">Cần làm</Option>
            <Option value="InProgress">Đang làm</Option>
            <Option value="Done">Hoàn thành</Option>
          </Select>

          <Select
            className="w-40"
            value={priorityFilter}
            onChange={(v: any) => setPriorityFilter(v)}
          >
            <Option value="All">Tất cả ưu tiên</Option>
            <Option value="Cao">Cao</Option>
            <Option value="Trung bình">Trung bình</Option>
            <Option value="Thấp">Thấp</Option>
          </Select>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={filteredTasks}
        rowKey="id"
        pagination={{ pageSize: 10, showSizeChanger: true }}
      />
    </div>
  );
}
