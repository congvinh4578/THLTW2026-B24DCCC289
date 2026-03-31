import { useApp } from '../context/AppContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function Dashboard() {
  const { clubs, registrations } = useApp();

  const stats = {
    clubs: clubs.length,
    pending: registrations.filter((r) => r.status === 'Pending').length,
    approved: registrations.filter((r) => r.status === 'Approved').length,
    rejected: registrations.filter((r) => r.status === 'Rejected').length,
  };

  const chartData = clubs.map((club) => {
    const clubRegs = registrations.filter((r) => r.clubId === club.id);
    return {
      name:
        club.name.length > 12 ? club.name.substring(0, 12) + '...' : club.name,
      Pending: clubRegs.filter((r) => r.status === 'Pending').length,
      Approved: clubRegs.filter((r) => r.status === 'Approved').length,
      Rejected: clubRegs.filter((r) => r.status === 'Rejected').length,
    };
  });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Báo cáo thống kê</h1>

      <div className="grid grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-6 rounded-3xl shadow-sm border">
          <p className="text-gray-500">Tổng CLB</p>
          <p className="text-4xl font-semibold text-blue-600 mt-2">
            {stats.clubs}
          </p>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border">
          <p className="text-gray-500">Đơn Pending</p>
          <p className="text-4xl font-semibold text-amber-500 mt-2">
            {stats.pending}
          </p>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border">
          <p className="text-gray-500">Đơn Approved</p>
          <p className="text-4xl font-semibold text-emerald-500 mt-2">
            {stats.approved}
          </p>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border">
          <p className="text-gray-500">Đơn Rejected</p>
          <p className="text-4xl font-semibold text-red-500 mt-2">
            {stats.rejected}
          </p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-sm border">
        <h2 className="text-xl font-semibold mb-6">Số đơn đăng ký theo CLB</h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Pending" fill="#f59e0b" />
            <Bar dataKey="Approved" fill="#10b981" />
            <Bar dataKey="Rejected" fill="#ef4444" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
