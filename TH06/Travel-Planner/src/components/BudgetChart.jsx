import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Alert } from 'antd';

export default function BudgetChart({ budget }) {
  const data = [
    { name: 'Ăn uống', value: budget.spent.anUong, color: '#10b981' },
    { name: 'Di chuyển', value: budget.spent.diChuyen, color: '#3b82f6' },
    { name: 'Lưu trú', value: budget.spent.luuTru, color: '#8b5cf6' },
    { name: 'Khác', value: budget.spent.khac, color: '#f59e0b' },
  ];

  const totalSpent = Object.values(budget.spent).reduce((a, b) => a + b, 0);
  const percent = Math.round((totalSpent / budget.total) * 100);

  return (
    <div>
      {percent > 85 && (
        <Alert
          message={`CẢNH BÁO: Đã dùng ${percent}% ngân sách!`}
          type="error"
          showIcon
          className="mb-6"
        />
      )}

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={120}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => value.toLocaleString('vi-VN') + ' ₫'}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>

      <div className="text-center mt-4">
        <p className="text-2xl font-bold text-emerald-700">
          {totalSpent.toLocaleString('vi-VN')} /{' '}
          {budget.total.toLocaleString('vi-VN')} ₫
        </p>
        <p className="text-sm text-gray-500">Đã chi tiêu {percent}%</p>
      </div>
    </div>
  );
}
