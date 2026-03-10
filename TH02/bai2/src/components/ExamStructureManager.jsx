import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const ExamStructureManager = () => {
  const [structures, setStructures] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [newStructure, setNewStructure] = useState({
    subjectId: '',
    items: [],
  });
  const [newItem, setNewItem] = useState({
    knowledgeBlockId: '',
    difficulty: '',
    count: 0,
  });

  useEffect(() => {
    const storedStructures =
      JSON.parse(localStorage.getItem('examStructures')) || [];
    const storedSubjects = JSON.parse(localStorage.getItem('subjects')) || [];
    const storedBlocks =
      JSON.parse(localStorage.getItem('knowledgeBlocks')) || [];
    setStructures(storedStructures);
    setSubjects(storedSubjects);
    setBlocks(storedBlocks);
  }, []);

  useEffect(() => {
    localStorage.setItem('examStructures', JSON.stringify(structures));
  }, [structures]);

  const addItem = () => {
    if (newItem.knowledgeBlockId && newItem.difficulty && newItem.count > 0) {
      setNewStructure({
        ...newStructure,
        items: [...newStructure.items, newItem],
      });
      setNewItem({ knowledgeBlockId: '', difficulty: '', count: 0 });
    }
  };

  const addStructure = () => {
    if (newStructure.subjectId && newStructure.items.length > 0) {
      setStructures([...structures, { id: uuidv4(), ...newStructure }]);
      setNewStructure({ subjectId: '', items: [] });
    }
  };

  const deleteStructure = (id) => {
    setStructures(structures.filter((s) => s.id !== id));
  };

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-2xl mb-4">Quản Lý Cấu Trúc Đề Thi</h2>
      <select
        value={newStructure.subjectId}
        onChange={(e) =>
          setNewStructure({ ...newStructure, subjectId: e.target.value })
        }
        className="border p-2 mb-4"
      >
        <option value="">Chọn Môn Học</option>
        {subjects.map((sub) => (
          <option key={sub.id} value={sub.id}>
            {sub.name}
          </option>
        ))}
      </select>
      <div className="mb-4">
        <h3 className="text-xl mb-2">Thêm Yêu Cầu Câu Hỏi</h3>
        <select
          value={newItem.knowledgeBlockId}
          onChange={(e) =>
            setNewItem({ ...newItem, knowledgeBlockId: e.target.value })
          }
          className="border p-2 mr-2"
        >
          <option value="">Khối Kiến Thức</option>
          {blocks.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
        <select
          value={newItem.difficulty}
          onChange={(e) =>
            setNewItem({ ...newItem, difficulty: e.target.value })
          }
          className="border p-2 mr-2"
        >
          <option value="">Mức Độ Khó</option>
          {difficulties.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
        <input
          type="number"
          value={newItem.count}
          onChange={(e) =>
            setNewItem({ ...newItem, count: parseInt(e.target.value) })
          }
          className="border p-2 mr-2"
          placeholder="Số Lượng"
        />
        <button
          onClick={addItem}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Thêm Yêu Cầu
        </button>
      </div>
      <ul className="mb-4">
        {newStructure.items.map((item, index) => (
          <li key={index}>
            {blocks.find((b) => b.id === item.knowledgeBlockId)?.name} -{' '}
            {item.difficulty} - {item.count} câu
          </li>
        ))}
      </ul>
      <button
        onClick={addStructure}
        className="bg-green-500 text-white p-2 rounded"
      >
        Lưu Cấu Trúc
      </button>
      <h3 className="text-xl mt-6 mb-2">Danh Sách Cấu Trúc</h3>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">Môn Học</th>
            <th className="p-2">Cấu Trúc</th>
            <th className="p-2">Hành Động</th>
          </tr>
        </thead>
        <tbody>
          {structures.map((struct) => (
            <tr key={struct.id}>
              <td className="p-2">
                {subjects.find((s) => s.id === struct.subjectId)?.name}
              </td>
              <td className="p-2">
                <ul>
                  {struct.items.map((item, idx) => (
                    <li key={idx}>
                      {blocks.find((b) => b.id === item.knowledgeBlockId)?.name}{' '}
                      - {item.difficulty} - {item.count} câu
                    </li>
                  ))}
                </ul>
              </td>
              <td className="p-2">
                <button
                  onClick={() => deleteStructure(struct.id)}
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

export default ExamStructureManager;
