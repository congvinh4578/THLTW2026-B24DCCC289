import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CourseForm from '../components/CourseForm';

export default function EditCourse() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    lecturer: '',
    students: 0,
    description: '',
    status: 'Đang mở',
  });
  const [loading, setLoading] = useState(true);

  const lecturers = ['Nguyễn Văn A', 'Trần Thị B', 'Lê Văn C'];
  const statuses = ['Đang mở', 'Đã kết thúc', 'Tạm dừng'];

  useEffect(() => {
    const courses = JSON.parse(localStorage.getItem('courses')) || [];
    const courseToEdit = courses.find((c) => c.id === parseInt(id));

    if (courseToEdit) {
      setFormData(courseToEdit);
    } else {
      alert('Không tìm thấy khóa học!');
      navigate('/courses');
    }
    setLoading(false);
  }, [id, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim())
      return alert('Tên khóa học không được để trống!');
    if (formData.name.length > 100)
      return alert('Tên khóa học tối đa 100 ký tự!');

    const courses = JSON.parse(localStorage.getItem('courses')) || [];
    const isDuplicate = courses.some(
      (c) =>
        c.name.toLowerCase() === formData.name.toLowerCase() &&
        c.id !== parseInt(id),
    );
    if (isDuplicate) return alert('Tên khóa học đã tồn tại!');

    const updatedCourses = courses.map((c) =>
      c.id === parseInt(id) ? { ...c, ...formData } : c,
    );

    localStorage.setItem('courses', JSON.stringify(updatedCourses));
    alert('✅ Cập nhật khóa học thành công!');
    navigate('/courses');
  };

  if (loading) return <div className="p-10 text-2xl">Đang tải dữ liệu...</div>;

  return (
    <div className="p-10 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900">
            Chỉnh sửa khóa học
          </h1>
          <p className="text-gray-500 mt-2 text-lg">
            ID: <span className="font-mono text-blue-600">#{id}</span>
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-12 border border-gray-100">
          <form onSubmit={handleSubmit}>
            <CourseForm
              formData={formData}
              setFormData={setFormData}
              lecturers={lecturers}
              statuses={statuses}
              isEditing={true}
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
                className="px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-3xl hover:from-blue-700 hover:to-indigo-700 transition shadow-lg shadow-blue-500/30 flex items-center gap-3"
              >
                💾 Cập nhật khóa học
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
