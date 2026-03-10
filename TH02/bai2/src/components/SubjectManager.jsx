import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const SubjectManager = () => {
  const [subjects, setSubjects] = useState([]);
  const [newSubject, setNewSubject] = useState({
    code: '',
    name: '',
    credits: '',
  });

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('subjects')) || [];
    setSubjects(stored);
  }, []);

  useEffect(() => {
    localStorage.setItem('subjects', JSON.stringify(subjects));
  }, [subjects]);

  const addSubject = () => {
    if (newSubject.code && newSubject.name && newSubject.credits) {
      setSubjects([...subjects, { id: uuidv4(), ...newSubject }]);
      setNewSubject({ code: '', name: '', credits: '' });
    }
  };

  const deleteSubject = (id) => {
    setSubjects(subjects.filter((subject) => subject.id !== id));
  };

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-2xl mb-4">Quản Lý Môn Học</h2>
      <div className="flex space-x-2 mb-4">
        <input
          type="text"
          value={newSubject.code}
          onChange={(e) =>
            setNewSubject({ ...newSubject, code: e.target.value })
          }
          className="border p-2"
          placeholder="Mã môn"
        />
        <input
          type="text"
          value={newSubject.name}
          onChange={(e) =>
            setNewSubject({ ...newSubject, name: e.target.value })
          }
          className="border p-2"
          placeholder="Tên môn"
        />
        <input
          type="number"
          value={newSubject.credits}
          onChange={(e) =>
            setNewSubject({ ...newSubject, credits: e.target.value })
          }
          className="border p-2"
          placeholder="Số tín chỉ"
        />
        <button
          onClick={addSubject}
          className="bg-green-500 text-white p-2 rounded"
        >
          Thêm
        </button>
      </div>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">Mã Môn</th>
            <th className="p-2">Tên Môn</th>
            <th className="p-2">Số Tín Chỉ</th>
            <th className="p-2">Hành Động</th>
          </tr>
        </thead>
        <tbody>
          {subjects.map((subject) => (
            <tr key={subject.id}>
              <td className="p-2">{subject.code}</td>
              <td className="p-2">{subject.name}</td>
              <td className="p-2">{subject.credits}</td>
              <td className="p-2">
                <button
                  onClick={() => deleteSubject(subject.id)}
                  className="bg-red-500 text-white p-1 rounded"
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SubjectManager;
