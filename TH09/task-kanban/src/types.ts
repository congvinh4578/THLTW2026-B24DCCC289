export type Priority = 'Cao' | 'Trung bình' | 'Thấp';
export type Status = 'Todo' | 'InProgress' | 'Done';

export interface Task {
  id: string;
  title: string;
  description: string;
  deadline: string;
  priority: Priority;
  status: Status;
  tags: string[];
  createdAt: string;
}
