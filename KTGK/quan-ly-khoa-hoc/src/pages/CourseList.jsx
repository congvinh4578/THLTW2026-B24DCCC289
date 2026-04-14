import { useState, useEffect } from 'react';
import Filters from '../components/Filters';
import CourseTable from '../components/CourseTable';
import { initialCourses } from '../data/initialCourses';

export default function CourseList() {
  const [courses, setCourses] = useState(initialCourses);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLecturer, setFilterLecturer] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [sortDirection, setSortDirection] = useState('desc');
  const lecturers = ['Nguyễn Văn A', 'Trần Thị B', 'Lê Văn C'];
  const statuses = ['Đang mở', 'Đã kết thúc', 'Tạm dừng'];
  useEffect(() => {
    const savedCourses = JSON.parse(localStorage.getItem('courses'));
    if (savedCourses && savedCourses.length > 0) {
      setCourses(savedCourses);
    } else {
      localStorage.setItem('courses', JSON.stringify(initialCourses));
    }
  }, []);
  const filteredCourses = courses
    .filter(
      (c) =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (!filterLecturer || c.lecturer === filterLecturer) &&
        (!filterStatus || c.status === filterStatus),
    )
    .sort((a, b) =>
      sortDirection === 'desc'
        ? b.students - a.students
        : a.students - b.students,
    );

  const toggleSort = () => {
    setSortDirection((prev) => (prev === 'desc' ? 'asc' : 'desc'));
  };

  const handleDelete = (course) => {
    if (course.students > 0) {
      alert('❌ Không thể xóa khóa học đang có học viên!');
      return;
    }

    if (window.confirm(`Xác nhận xóa khóa học: "${course.name}"?`)) {
      const updatedCourses = courses.filter((c) => c.id !== course.id);
      setCourses(updatedCourses);
      localStorage.setItem('courses', JSON.stringify(updatedCourses));
    }
  };

  return (
    <div className="p-10">
      <div className="flex justify-center mb-10">
        <h1 className="text-4xl font-bold text-gray-900">Danh sách khóa học</h1>
      </div>

      <Filters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterLecturer={filterLecturer}
        setFilterLecturer={setFilterLecturer}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        sortDirection={sortDirection}
        toggleSort={toggleSort}
        lecturers={lecturers}
        statuses={statuses}
      />

      <CourseTable courses={filteredCourses} onDelete={handleDelete} />
    </div>
  );
}
