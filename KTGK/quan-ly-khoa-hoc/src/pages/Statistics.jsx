import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, BookOpen, Award } from 'lucide-react';
import { initialCourses } from '../data/initialCourses';

export default function Statistics() {
  const [courses, setCourses] = useState(initialCourses);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('courses'));
    if (saved) setCourses(saved);
  }, []);

  const totalCourses = courses.length;
  const totalStudents = courses.reduce((sum, c) => sum + (c.students || 0), 0);
  const activeCourses = courses.filter((c) => c.status === 'Đang mở').length;
  const pausedCourses = courses.filter((c) => c.status === 'Tạm dừng').length;
  const finishedCourses = courses.filter(
    (c) => c.status === 'Đã kết thúc',
  ).length;

  const lecturerStats = courses.reduce((acc, course) => {
    acc[course.lecturer] = (acc[course.lecturer] || 0) + course.students;
    return acc;
  }, {});

  const topLecturers = Object.entries(lecturerStats)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  return (
    <div className="p-10 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-4">
            <BarChart3 size={40} className="text-blue-600" />
            Thống kê tổng quan
          </h1>
          <p className="text-gray-600 mt-2 text-lg">
            Báo cáo chi tiết hệ thống khóa học
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-3xl p-8 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-blue-100 rounded-2xl">
                <BookOpen size={32} className="text-blue-600" />
              </div>
              <div>
                <p className="text-5xl font-bold">{totalCourses}</p>
                <p className="text-gray-500">Tổng khóa học</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-emerald-100 rounded-2xl">
                <Users size={32} className="text-emerald-600" />
              </div>
              <div>
                <p className="text-5xl font-bold">{totalStudents}</p>
                <p className="text-gray-500">Tổng học viên</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-amber-100 rounded-2xl">
                <TrendingUp size={32} className="text-amber-600" />
              </div>
              <div>
                <p className="text-5xl font-bold">{activeCourses}</p>
                <p className="text-gray-500">Đang mở</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-purple-100 rounded-2xl">
                <Award size={32} className="text-purple-600" />
              </div>
              <div>
                <p className="text-5xl font-bold">{finishedCourses}</p>
                <p className="text-gray-500">Đã kết thúc</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-10 shadow-lg mb-12">
          <h2 className="text-2xl font-semibold mb-8 flex items-center gap-3">
            🏆 Top giảng viên có nhiều học viên nhất
          </h2>
          <div className="space-y-6">
            {topLecturers.map(([lecturer, students], index) => (
              <div
                key={lecturer}
                className="flex items-center justify-between bg-gray-50 rounded-2xl p-6"
              >
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-2xl flex items-center justify-center font-bold text-xl">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-xl">{lecturer}</p>
                    <p className="text-gray-500">Giảng viên</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-4xl font-bold text-blue-600">{students}</p>
                  <p className="text-sm text-gray-500">học viên</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
          <div className="p-8 border-b">
            <h2 className="text-2xl font-semibold">
              Danh sách tất cả khóa học
            </h2>
          </div>
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-8 py-5 text-left">Tên khóa học</th>
                <th className="px-8 py-5 text-left">Giảng viên</th>
                <th className="px-8 py-5 text-center">Học viên</th>
                <th className="px-8 py-5 text-center">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {courses.map((course) => (
                <tr key={course.id} className="hover:bg-gray-50">
                  <td className="px-8 py-6 font-medium">{course.name}</td>
                  <td className="px-8 py-6 text-gray-600">{course.lecturer}</td>
                  <td className="px-8 py-6 text-center font-bold text-xl text-blue-600">
                    {course.students}
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span
                      className={`inline-block px-6 py-2 text-sm rounded-full font-medium
                      ${
                        course.status === 'Đang mở'
                          ? 'bg-emerald-100 text-emerald-700'
                          : course.status === 'Đã kết thúc'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-orange-100 text-orange-700'
                      }`}
                    >
                      {course.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
