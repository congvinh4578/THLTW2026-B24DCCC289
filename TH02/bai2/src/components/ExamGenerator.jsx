import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const ExamGenerator = () => {
  const [exams, setExams] = useState([]);
  const [structures, setStructures] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [selectedStructureId, setSelectedStructureId] = useState('');
  const [generatedExam, setGeneratedExam] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const storedExams = JSON.parse(localStorage.getItem('exams')) || [];
    const storedStructures =
      JSON.parse(localStorage.getItem('examStructures')) || [];
    const storedQuestions = JSON.parse(localStorage.getItem('questions')) || [];
    const storedSubjects = JSON.parse(localStorage.getItem('subjects')) || [];
    const storedBlocks =
      JSON.parse(localStorage.getItem('knowledgeBlocks')) || [];
    setExams(storedExams);
    setStructures(storedStructures);
    setQuestions(storedQuestions);
    setSubjects(storedSubjects);
    setBlocks(storedBlocks);
  }, []);

  useEffect(() => {
    localStorage.setItem('exams', JSON.stringify(exams));
  }, [exams]);

  const generateExam = () => {
    setError('');
    setGeneratedExam(null);
    const structure = structures.find((s) => s.id === selectedStructureId);
    if (!structure) return;

    const selectedQuestions = [];
    for (const item of structure.items) {
      const available = questions.filter(
        (q) =>
          q.subjectId === structure.subjectId &&
          q.knowledgeBlockId === item.knowledgeBlockId &&
          q.difficulty === item.difficulty,
      );
      if (available.length < item.count) {
        setError(
          `Không đủ câu hỏi cho ${blocks.find((b) => b.id === item.knowledgeBlockId)?.name} - ${item.difficulty}`,
        );
        return;
      }

      const shuffled = available.sort(() => 0.5 - Math.random());
      selectedQuestions.push(...shuffled.slice(0, item.count));
    }

    const newExam = {
      id: uuidv4(),
      structureId: selectedStructureId,
      questions: selectedQuestions,
    };
    setExams([...exams, newExam]);
    setGeneratedExam(newExam);
  };

  const deleteExam = (id) => {
    setExams(exams.filter((e) => e.id !== id));
  };

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-2xl mb-4">Tạo Đề Thi</h2>
      <select
        value={selectedStructureId}
        onChange={(e) => setSelectedStructureId(e.target.value)}
        className="border p-2 mb-4"
      >
        <option value="">Chọn Cấu Trúc Đề Thi</option>
        {structures.map((struct) => (
          <option key={struct.id} value={struct.id}>
            {subjects.find((s) => s.id === struct.subjectId)?.name}
          </option>
        ))}
      </select>
      <button
        onClick={generateExam}
        className="bg-green-500 text-white p-2 rounded"
      >
        Tạo Đề Thi
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {generatedExam && (
        <div className="mt-4">
          <h3 className="text-xl mb-2">Đề Thi Đã Tạo</h3>
          <ul>
            {generatedExam.questions.map((q, index) => (
              <li key={index} className="mb-2">
                Câu {index + 1}: {q.content} ({q.difficulty},{' '}
                {blocks.find((b) => b.id === q.knowledgeBlockId)?.name})
              </li>
            ))}
          </ul>
        </div>
      )}
      <h3 className="text-xl mt-6 mb-2">Danh Sách Đề Thi Đã Lưu</h3>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">Môn Học</th>
            <th className="p-2">Số Câu Hỏi</th>
            <th className="p-2">Hành Động</th>
          </tr>
        </thead>
        <tbody>
          {exams.map((exam) => (
            <tr key={exam.id}>
              <td className="p-2">
                {
                  subjects.find((s) => {
                    const struct = structures.find(
                      (st) => st.id === exam.structureId,
                    );
                    return struct ? s.id === struct.subjectId : false;
                  })?.name
                }
              </td>
              <td className="p-2">{exam.questions.length}</td>
              <td className="p-2">
                <button
                  onClick={() => deleteExam(exam.id)}
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

export default ExamGenerator;
