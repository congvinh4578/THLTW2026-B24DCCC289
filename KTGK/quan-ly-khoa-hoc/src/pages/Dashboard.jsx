import { useState, useEffect } from 'react';
import { BookOpen, Users, Clock, PauseCircle, TrendingUp } from 'lucide-react';
import { initialCourses } from '../data/initialCourses';

export default function Dashboard() {
  const [courses, setCourses] = useState(initialCourses);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('courses'));
    if (saved) setCourses(saved);
  }, []);

  const totalCourses = courses.length;
  const totalStudents = courses.reduce((sum, c) => sum + c.students, 0);
  const activeCourses = courses.filter((c) => c.status === 'Đang mở').length;
  const pausedCourses = courses.filter((c) => c.status === 'Tạm dừng').length;
  const recentCourses = [...courses].sort((a, b) => b.id - a.id).slice(0, 3);

  return (
    <div className="p-10 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-gray-900">
            Chào mừng quay trở lại 👋
          </h1>
          <p className="text-xl text-gray-600 mt-3">
            Hôm nay là ngày {new Date().toLocaleDateString('vi-VN')}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all group">
            <div className="flex items-center justify-between">
              <div className="p-4 bg-blue-100 rounded-2xl group-hover:bg-blue-200 transition">
                <BookOpen size={32} className="text-blue-600" />
              </div>
              <div className="text-right">
                <p className="text-5xl font-bold text-gray-900">
                  {totalCourses}
                </p>
                <p className="text-gray-500 text-sm mt-1">Tổng khóa học</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all group">
            <div className="flex items-center justify-between">
              <div className="p-4 bg-emerald-100 rounded-2xl group-hover:bg-emerald-200 transition">
                <Users size={32} className="text-emerald-600" />
              </div>
              <div className="text-right">
                <p className="text-5xl font-bold text-gray-900">
                  {totalStudents}
                </p>
                <p className="text-gray-500 text-sm mt-1">Tổng học viên</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all group">
            <div className="flex items-center justify-between">
              <div className="p-4 bg-amber-100 rounded-2xl group-hover:bg-amber-200 transition">
                <Clock size={32} className="text-amber-600" />
              </div>
              <div className="text-right">
                <p className="text-5xl font-bold text-gray-900">
                  {activeCourses}
                </p>
                <p className="text-gray-500 text-sm mt-1">Khóa đang mở</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all group">
            <div className="flex items-center justify-between">
              <div className="p-4 bg-orange-100 rounded-2xl group-hover:bg-orange-200 transition">
                <PauseCircle size={32} className="text-orange-600" />
              </div>
              <div className="text-right">
                <p className="text-5xl font-bold text-gray-900">
                  {pausedCourses}
                </p>
                <p className="text-gray-500 text-sm mt-1">Khóa tạm dừng</p>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              Khóa học gần đây
            </h2>
            <a
              href="/courses"
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
            >
              Xem tất cả <TrendingUp size={18} />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentCourses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-3xl p-7 shadow hover:shadow-xl transition-all border border-gray-100"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg line-clamp-2">
                      {course.name}
                    </h3>
                    <p className="text-gray-500 text-sm mt-1">
                      {course.lecturer}
                    </p>
                  </div>
                  <span
                    className={`px-4 py-1.5 text-xs font-medium rounded-2xl
                    ${
                      course.status === 'Đang mở'
                        ? 'bg-emerald-100 text-emerald-700'
                        : course.status === 'Tạm dừng'
                          ? 'bg-orange-100 text-orange-700'
                          : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {course.status}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-6">
                  <div>
                    <p className="text-3xl font-bold text-blue-600">
                      {course.students}
                    </p>
                    <p className="text-xs text-gray-500">học viên</p>
                  </div>
                  <button
                    onClick={() =>
                      (window.location.href = `/courses/${course.id}/edit`)
                    }
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Chi tiết →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
