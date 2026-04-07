import { useState } from 'react';
import { Table, Button, Input, Form, Select } from 'antd';
import { destinations } from '../data/destinations';

const { Option } = Select;

export default function Admin() {
  const [data, setData] = useState(destinations);
  const [form] = Form.useForm();

  const columns = [
    { title: 'Tên', dataIndex: 'name', key: 'name' },
    { title: 'Loại', dataIndex: 'type', key: 'type' },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      render: (p) => p.toLocaleString('vi-VN') + ' ₫',
    },
    { title: 'Đánh giá', dataIndex: 'rating', key: 'rating' },
  ];

  const onFinish = (values) => {
    const newDest = { ...values, id: Date.now() };
    setData([...data, newDest]);
    form.resetFields();
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Quản Trị - Điểm Đến</h1>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className="mb-12 bg-white p-6 rounded-2xl shadow"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Form.Item
            name="name"
            label="Tên điểm đến"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="type" label="Loại hình">
            <Select>
              <Option value="biển">Biển</Option>
              <Option value="núi">Núi</Option>
              <Option value="thành phố">Thành phố</Option>
            </Select>
          </Form.Item>
          <Form.Item name="price" label="Giá">
            <Input type="number" />
          </Form.Item>
          <Form.Item name="rating" label="Rating">
            <Input type="number" step="0.1" />
          </Form.Item>
        </div>
        <Button type="primary" htmlType="submit" block>
          Thêm điểm đến mới
        </Button>
      </Form>

      <Table columns={columns} dataSource={data} rowKey="id" />
    </div>
  );
}
