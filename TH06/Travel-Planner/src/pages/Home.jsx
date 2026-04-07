import { useState } from 'react';
import { Select, Input, Button } from 'antd';
import DestinationCard from '../components/DestinationCard';
import { useTravel } from '../context/TravelContext';
import { SearchOutlined } from '@ant-design/icons';

const { Option } = Select;

export default function Home() {
  const { destinations } = useTravel();
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('rating');

  const filtered = destinations
    .filter((d) => filterType === 'all' || d.type === filterType)
    .sort((a, b) => {
      if (sortBy === 'price') return a.price - b.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-2 text-emerald-700">
          Khám Phá Điểm Đến
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Chọn điểm đến cho chuyến đi mơ ước của bạn
        </p>

        <div className="flex flex-col md:flex-row gap-4 mb-8 items-start md:items-center">
          <Select
            className="w-full md:w-64"
            placeholder="Loại hình"
            onChange={setFilterType}
            value={filterType}
          >
            <Option value="all">Tất cả</Option>
            <Option value="biển">Biển</Option>
            <Option value="núi">Núi</Option>
            <Option value="thành phố">Thành phố</Option>
          </Select>

          <Select
            className="w-full md:w-64"
            placeholder="Sắp xếp theo"
            onChange={setSortBy}
            value={sortBy}
          >
            <Option value="rating">Đánh giá cao nhất</Option>
            <Option value="price">Giá thấp nhất</Option>
          </Select>

          <Input
            placeholder="Tìm kiếm điểm đến..."
            prefix={<SearchOutlined />}
            className="flex-1"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((dest) => (
            <DestinationCard key={dest.id} dest={dest} />
          ))}
        </div>
      </div>
    </div>
  );
}
