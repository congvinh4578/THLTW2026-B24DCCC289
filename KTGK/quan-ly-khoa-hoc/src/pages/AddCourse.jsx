import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CourseForm from '../components/CourseForm';

export default function AddCourse({ showToast }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    lecturer: 'Nguyễn Văn A',
    students: 0,
    description: '',
    status: 'Đang mở',
  });

  const lecturers = ['Nguyễn Văn A', 'Trần Thị B', 'Lê Văn C'];
  const statuses = ['Đang mở', 'Đã kết thúc', 'Tạm dừng'];

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      showToast('Tên khóa học không được để trống!', 'error');
      return;
    }
    if (formData.name.length > 100) {
      showToast('Tên khóa học tối đa 100 ký tự!', 'error');
      return;
    }

    const existingCourses = JSON.parse(localStorage.getItem('courses')) || [];

    const isDuplicate = existingCourses.some(
      (c) => c.name.toLowerCase() === formData.name.toLowerCase(),
    );
    if (isDuplicate) {
      showToast('Tên khóa học đã tồn tại!', 'error');
      return;
    }
    const newId =
      existingCourses.length > 0
        ? Math.max(...existingCourses.map((c) => c.id)) + 1
        : 1;

    const newCourse = {
      id: newId,
      ...formData,
    };

    localStorage.setItem(
      'courses',
      JSON.stringify([...existingCourses, newCourse]),
    );

    showToast('✅ Thêm khóa học thành công!');
    navigate('/courses');
  };

  return (
    <div className="p-10 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900">
            Thêm khóa học mới
          </h1>
          <p className="text-gray-500 mt-2 text-lg">
            Tạo một khóa học mới cho hệ thống
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-12 border border-gray-100">
          <form onSubmit={handleSubmit}>
            <CourseForm
              formData={formData}
              setFormData={setFormData}
              lecturers={lecturers}
              statuses={statuses}
              isEditing={false}
            />

            <div className="flex justify-end gap-5 mt-14">
              <button
                type="button"
                onClick={() => navigate('/courses')}
                className="px-10 py-4 text-gray-700 font-medium border border-gray-300 rounded-3xl hover:bg-gray-100 transition"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                className="px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-3xl hover:from-blue-700 hover:to-indigo-700 transition shadow-lg shadow-blue-500/30"
              >
                ✅ Tạo khóa học mới
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
