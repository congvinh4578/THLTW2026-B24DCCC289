export default function CourseForm({
  formData,
  setFormData,
  lecturers,
  statuses,
  isEditing,
}) {
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === 'students' ? (value === '' ? 0 : Number(value)) : value,
    }));
  };

  return (
    <div className="space-y-8">
      <div>
        <label className="block text-sm font-semibold mb-3 text-gray-700">
          Tên khóa học <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          maxLength={100}
          required
          className="w-full px-6 py-5 border border-gray-200 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
          placeholder="Ví dụ: React & TypeScript Master 2026"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold mb-3 text-gray-700">
            Giảng viên
          </label>
          <select
            name="lecturer"
            value={formData.lecturer}
            onChange={handleChange}
            className="w-full px-6 py-5 border border-gray-200 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {lecturers.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-3 text-gray-700">
            Số lượng học viên
          </label>
          <input
            type="number"
            name="students"
            value={formData.students === 0 ? '' : formData.students}
            onChange={handleChange}
            min={0}
            className="w-full px-6 py-5 border border-gray-200 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
            placeholder="0"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-semibold mb-3 text-gray-700">
          Trạng thái
        </label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full px-6 py-5 border border-gray-200 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-semibold mb-3 text-gray-700">
          Mô tả khóa học (HTML)
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={8}
          className="w-full px-6 py-5 border border-gray-200 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm resize-y"
          placeholder="Nhập mô tả khóa học tại đây... (có thể dùng HTML)"
        />
      </div>
      {formData.description && (
        <div className="mt-6 p-6 bg-gray-50 border border-gray-100 rounded-3xl">
          <p className="text-xs uppercase tracking-widest text-gray-500 mb-3">
            Xem trước mô tả:
          </p>
          <div
            className="prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: formData.description }}
          />
        </div>
      )}
    </div>
  );
}
