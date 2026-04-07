import { Card, Button, List } from 'antd';
import {
  DeleteOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from '@ant-design/icons';
import { useTravel } from '../context/TravelContext';

export default function ItineraryDay({ day, dayDestinations, index }) {
  const { removeFromItinerary, calculateTravelTime } = useTravel();

  return (
    <Card title={`Ngày ${day}`} className="mb-6">
      <List
        dataSource={dayDestinations}
        renderItem={(dest, i) => (
          <List.Item
            actions={[
              <Button
                icon={<ArrowUpOutlined />}
                size="small"
                disabled={i === 0}
              />,
              <Button
                icon={<ArrowDownOutlined />}
                size="small"
                disabled={i === dayDestinations.length - 1}
              />,
              <Button
                danger
                icon={<DeleteOutlined />}
                onClick={() => removeFromItinerary(dest.id)}
              />,
            ]}
          >
            <div className="flex items-center gap-4 w-full">
              <img
                src={dest.image}
                alt=""
                className="w-16 h-16 object-cover rounded"
              />
              <div className="flex-1">
                <h4 className="font-semibold">{dest.name}</h4>
                <p className="text-sm text-gray-500">{dest.description}</p>
              </div>
              {i < dayDestinations.length - 1 && (
                <span className="text-xs bg-orange-100 text-orange-600 px-3 py-1 rounded-full">
                  {calculateTravelTime(dest.id, dayDestinations[i + 1].id)} giờ
                </span>
              )}
            </div>
          </List.Item>
        )}
      />
    </Card>
  );
}
