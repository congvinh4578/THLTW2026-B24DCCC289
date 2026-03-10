import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const difficulties = ['Dễ', 'Trung bình', 'Khó', 'Rất khó'];

const QuestionManager = () => {
  const [questions, setQuestions] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [newQuestion, setNewQuestion] = useState({
    subjectId: '',
    content: '',
    difficulty: '',
    knowledgeBlockId: '',
  });
  const [search, setSearch] = useState({
    subjectId: '',
    difficulty: '',
    knowledgeBlockId: '',
  });
  const [filteredQuestions, setFilteredQuestions] = useState([]);

  useEffect(() => {
    const storedQuestions = JSON.parse(localStorage.getItem('questions')) || [];
    const storedSubjects = JSON.parse(localStorage.getItem('subjects')) || [];
    const storedBlocks =
      JSON.parse(localStorage.getItem('knowledgeBlocks')) || [];
    setQuestions(storedQuestions);
    setSubjects(storedSubjects);
    setBlocks(storedBlocks);
    setFilteredQuestions(storedQuestions);
  }, []);

  useEffect(() => {
    localStorage.setItem('questions', JSON.stringify(questions));
  }, [questions]);

  const addQuestion = () => {
    if (
      newQuestion.subjectId &&
      newQuestion.content &&
      newQuestion.difficulty &&
      newQuestion.knowledgeBlockId
    ) {
      setQuestions([...questions, { id: uuidv4(), ...newQuestion }]);
      setNewQuestion({
        subjectId: '',
        content: '',
        difficulty: '',
        knowledgeBlockId: '',
      });
    }
  };

  const deleteQuestion = (id) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const handleSearch = () => {
    let filtered = questions;
    if (search.subjectId)
      filtered = filtered.filter((q) => q.subjectId === search.subjectId);
    if (search.difficulty)
      filtered = filtered.filter((q) => q.difficulty === search.difficulty);
    if (search.knowledgeBlockId)
      filtered = filtered.filter(
        (q) => q.knowledgeBlockId === search.knowledgeBlockId,
      );
    setFilteredQuestions(filtered);
  };

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-2xl mb-4">Quản Lý Câu Hỏi</h2>
      <div className="mb-4">
        <select
          value={newQuestion.subjectId}
          onChange={(e) =>
            setNewQuestion({ ...newQuestion, subjectId: e.target.value })
          }
          className="border p-2 mr-2"
        >
          <option value="">Chọn Môn Học</option>
          {subjects.map((sub) => (
            <option key={sub.id} value={sub.id}>
              {sub.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={newQuestion.content}
          onChange={(e) =>
            setNewQuestion({ ...newQuestion, content: e.target.value })
          }
          className="border p-2 mr-2"
          placeholder="Nội dung câu hỏi"
        />
        <select
          value={newQuestion.difficulty}
          onChange={(e) =>
            setNewQuestion({ ...newQuestion, difficulty: e.target.value })
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
        <select
          value={newQuestion.knowledgeBlockId}
          onChange={(e) =>
            setNewQuestion({ ...newQuestion, knowledgeBlockId: e.target.value })
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
        <button
          onClick={addQuestion}
          className="bg-green-500 text-white p-2 rounded"
        >
          Thêm
        </button>
      </div>
      <div className="mb-4">
        <h3 className="text-xl mb-2">Tìm Kiếm Câu Hỏi</h3>
        <select
          value={search.subjectId}
          onChange={(e) => setSearch({ ...search, subjectId: e.target.value })}
          className="border p-2 mr-2"
        >
          <option value="">Chọn Môn Học</option>
          {subjects.map((sub) => (
            <option key={sub.id} value={sub.id}>
              {sub.name}
            </option>
          ))}
        </select>
        <select
          value={search.difficulty}
          onChange={(e) => setSearch({ ...search, difficulty: e.target.value })}
          className="border p-2 mr-2"
        >
          <option value="">Mức Độ Khó</option>
          {difficulties.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
        <select
          value={search.knowledgeBlockId}
          onChange={(e) =>
            setSearch({ ...search, knowledgeBlockId: e.target.value })
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
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Tìm
        </button>
      </div>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">Môn Học</th>
            <th className="p-2">Nội Dung</th>
            <th className="p-2">Mức Độ</th>
            <th className="p-2">Khối KT</th>
            <th className="p-2">Hành Động</th>
          </tr>
        </thead>
        <tbody>
          {filteredQuestions.map((q) => (
            <tr key={q.id}>
              <td className="p-2">
                {subjects.find((s) => s.id === q.subjectId)?.name}
              </td>
              <td className="p-2">{q.content}</td>
              <td className="p-2">{q.difficulty}</td>
              <td className="p-2">
                {blocks.find((b) => b.id === q.knowledgeBlockId)?.name}
              </td>
              <td className="p-2">
                <button
                  onClick={() => deleteQuestion(q.id)}
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

export default QuestionManager;
