import { Card, Rate, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useTravel } from '../context/TravelContext';

const { Meta } = Card;

export default function DestinationCard({ dest }) {
  const { addToItinerary } = useTravel();

  return (
    <Card
      hoverable
      cover={
        <img alt={dest.name} src={dest.image} className="h-48 object-cover" />
      }
      className="shadow-md hover:shadow-xl transition-all duration-300 w-full max-w-sm mx-auto"
      actions={[
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => addToItinerary(dest)}
          className="w-full"
        ></Button>,
      ]}
    >
      <Meta
        title={dest.name}
        description={
          <div>
            <div className="flex items-center justify-between">
              <span className="text-emerald-600 font-semibold">
                {dest.price.toLocaleString('vi-VN')} ₫
              </span>
              <Rate
                disabled
                value={dest.rating}
                allowHalf
                className="text-sm"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">{dest.description}</p>
          </div>
        }
      />
    </Card>
  );
}
