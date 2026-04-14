import { Edit2, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CourseTable({ courses, onDelete }) {
  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
      <table className="w-full">
        <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
          <tr>
            <th className="px-8 py-6 text-left text-sm font-semibold text-gray-600">
              ID
            </th>
            <th className="px-8 py-6 text-left text-sm font-semibold text-gray-600">
              Tên khóa học
            </th>
            <th className="px-8 py-6 text-left text-sm font-semibold text-gray-600">
              Giảng viên
            </th>
            <th className="px-8 py-6 text-left text-sm font-semibold text-gray-600">
              Học viên
            </th>
            <th className="px-8 py-6 text-left text-sm font-semibold text-gray-600">
              Trạng thái
            </th>
            <th className="px-8 py-6 text-center text-sm font-semibold text-gray-600">
              Thao tác
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {courses.map((course) => (
            <tr
              key={course.id}
              className="hover:bg-blue-50/50 transition-all group"
            >
              <td className="px-8 py-7 font-mono text-gray-500">{course.id}</td>
              <td className="px-8 py-7 font-semibold text-gray-900">
                {course.name}
              </td>
              <td className="px-8 py-7 text-gray-700">{course.lecturer}</td>
              <td className="px-8 py-7">
                <span className="text-2xl font-bold text-blue-600">
                  {course.students}
                </span>
              </td>
              <td className="px-8 py-7">
                <span
                  className={`px-5 py-2 text-sm font-medium rounded-full
                  ${
                    course.status === 'Đang mở'
                      ? 'bg-emerald-100 text-emerald-700'
                      : course.status === 'Đã kết thúc'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  {course.status}
                </span>
              </td>
              <td className="px-8 py-7 text-center">
                <div className="flex gap-3 justify-center">
                  <Link
                    to={`/courses/${course.id}/edit`}
                    className="p-3 hover:bg-blue-100 text-blue-600 rounded-2xl transition"
                  >
                    <Edit2 size={20} />
                  </Link>
                  <button
                    onClick={() => onDelete(course)}
                    className="p-3 hover:bg-red-100 text-red-600 rounded-2xl transition"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {courses.length === 0 && (
        <div className="py-24 text-center text-gray-400 text-xl">
          Không tìm thấy khóa học nào phù hợp
        </div>
      )}
    </div>
  );
}
