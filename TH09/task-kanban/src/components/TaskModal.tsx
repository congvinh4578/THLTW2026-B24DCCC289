import { Modal, Form, Input, DatePicker, Select } from 'antd';
import dayjs from 'dayjs';
import type { Task } from '../types';

const { TextArea } = Input;

interface Props {
  open: boolean;
  task?: Task | null;
  onClose: () => void;
  onSubmit: (values: any) => void;
}

export default function TaskModal({ open, task, onClose, onSubmit }: Props) {
  const [form] = Form.useForm();

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        onSubmit({
          ...values,
          deadline: values.deadline.toISOString(),
          tags: values.tags || [],
        });

        form.resetFields();
        onClose();
      })
      .catch(() => {});
  };

  return (
    <Modal
      title={task ? 'Chỉnh sửa công việc' : 'Tạo công việc mới'}
      open={open}
      onCancel={onClose}
      onOk={handleSubmit}
      width={680}
      destroyOnClose
      okText="Lưu"
      cancelText="Hủy"
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={
          task
            ? {
                ...task,
                deadline: dayjs(task.deadline),
              }
            : {
                priority: 'Trung bình',
                status: 'Todo',
              }
        }
      >
        <Form.Item
          name="title"
          label="Tên công việc"
          rules={[{ required: true, message: 'Vui lòng nhập tên công việc' }]}
        >
          <Input size="large" placeholder="Ví dụ: Viết tài liệu dự án" />
        </Form.Item>

        <Form.Item name="description" label="Mô tả">
          <TextArea rows={4} placeholder="Chi tiết công việc..." />
        </Form.Item>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="deadline"
            label="Hạn chót"
            rules={[{ required: true, message: 'Vui lòng chọn hạn chót' }]}
          >
            <DatePicker className="w-full" size="large" />
          </Form.Item>

          <Form.Item name="priority" label="Ưu tiên">
            <Select size="large">
              <Select.Option value="Cao">Cao</Select.Option>
              <Select.Option value="Trung bình">Trung bình</Select.Option>
              <Select.Option value="Thấp">Thấp</Select.Option>
            </Select>
          </Form.Item>
        </div>

        <Form.Item name="status" label="Trạng thái">
          <Select size="large">
            <Select.Option value="Todo">Cần làm</Select.Option>
            <Select.Option value="InProgress">Đang làm</Select.Option>
            <Select.Option value="Done">Hoàn thành</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item name="tags" label="Tags">
          <Select
            mode="tags"
            size="large"
            placeholder="Nhập tag và nhấn Enter"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
