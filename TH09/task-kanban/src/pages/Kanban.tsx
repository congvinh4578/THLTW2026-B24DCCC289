import { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useTasks } from '../context/TaskContext';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import type { Task, Status } from '../types';

const columns = [
  {
    id: 'Todo',
    title: 'Cần làm',
    color: 'border-blue-500 bg-blue-50 dark:bg-gray-900',
  },
  {
    id: 'InProgress',
    title: 'Đang làm',
    color: 'border-amber-500 bg-amber-50 dark:bg-gray-900',
  },
  {
    id: 'Done',
    title: 'Hoàn thành',
    color: 'border-emerald-500 bg-emerald-50 dark:bg-gray-900',
  },
];

interface KanbanProps {
  setModalOpen: (open: boolean) => void;
  setEditingTask: (task: Task | null) => void;
}

export default function Kanban({ setModalOpen, setEditingTask }: KanbanProps) {
  const { tasks, moveTask, deleteTask } = useTasks();

  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    const { draggableId, destination } = result;
    moveTask(draggableId, destination.droppableId as Status);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Kanban Board</h1>
        <button
          onClick={() => {
            setEditingTask(null);
            setModalOpen(true);
          }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-medium flex items-center gap-2 transition-all"
        >
          + Thêm task mới
        </button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {columns.map((col) => {
            const colTasks = tasks.filter((t) => t.status === col.id);

            return (
              <div
                key={col.id}
                className={`rounded-3xl border-2 ${col.color} p-6 min-h-[650px]`}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">{col.title}</h2>
                  <span className="bg-white dark:bg-gray-800 px-4 py-1.5 rounded-full text-sm font-medium shadow">
                    {colTasks.length}
                  </span>
                </div>

                <Droppable droppableId={col.id}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="space-y-4 min-h-[500px]"
                    >
                      {colTasks.map((task, index) => (
                        <Draggable
                          key={task.id}
                          draggableId={task.id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <TaskCard
                                task={task}
                                onEdit={(t) => {
                                  setEditingTask(t);
                                  setModalOpen(true);
                                }}
                                onDelete={deleteTask}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
}
