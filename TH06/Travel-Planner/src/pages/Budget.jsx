import BudgetChart from '../components/BudgetChart';
import { useTravel } from '../context/TravelContext';
import { InputNumber, Button } from 'antd';

export default function Budget() {
  const { budget, setBudget } = useTravel();

  const updateCategory = (category, value) => {
    setBudget((prev) => ({
      ...prev,
      spent: { ...prev.spent, [category]: value },
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Quản Lý Ngân Sách</h1>
      <BudgetChart budget={budget} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
        {Object.entries(budget.spent).map(([key, value]) => (
          <div key={key} className="bg-white p-6 rounded-2xl shadow">
            <h4 className="capitalize mb-2 font-medium">
              {key === 'anUong'
                ? 'Ăn uống'
                : key === 'diChuyen'
                  ? 'Di chuyển'
                  : key === 'luuTru'
                    ? 'Lưu trú'
                    : 'Khác'}
            </h4>
            <InputNumber
              value={value}
              onChange={(v) => updateCategory(key, v)}
              className="w-full"
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' ₫'
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
}
