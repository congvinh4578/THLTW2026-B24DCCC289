import { useState } from 'react';
import { Button, Alert } from 'antd';
import ItineraryDay from '../components/ItineraryDay';
import { useTravel } from '../context/TravelContext';

export default function Itinerary() {
  const { selectedDestinations, setItinerary } = useTravel();
  const [days, setDays] = useState(3);

  const groupByDay = () => {
    const perDay = Math.ceil(selectedDestinations.length / days);
    const result = [];
    for (let i = 0; i < days; i++) {
      result.push({
        day: i + 1,
        destinations: selectedDestinations.slice(i * perDay, (i + 1) * perDay),
      });
    }
    return result;
  };

  const itineraryDays = groupByDay();

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Lịch Trình Của Bạn</h1>

      {selectedDestinations.length === 0 ? (
        <Alert
          message="Chưa có điểm đến nào. Hãy quay lại trang chủ để thêm!"
          type="info"
          showIcon
        />
      ) : (
        <>
          <div className="flex gap-4 mb-6">
            <Button onClick={() => setDays((d) => d + 1)}>Thêm ngày</Button>
            <Button onClick={() => setDays((d) => Math.max(1, d - 1))}>
              Giảm ngày
            </Button>
          </div>

          {itineraryDays.map((dayData, i) => (
            <ItineraryDay
              key={i}
              day={dayData.day}
              dayDestinations={dayData.destinations}
            />
          ))}
        </>
      )}
    </div>
  );
}
