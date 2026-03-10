import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import KnowledgeBlockManager from './components/KnowledgeBlockManager';
import SubjectManager from './components/SubjectManager';
import QuestionManager from './components/QuestionManager';
import ExamStructureManager from './components/ExamStructureManager';
import ExamGenerator from './components/ExamGenerator';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-blue-600 text-white p-4">
          <ul className="flex space-x-4">
            <li>
              <Link to="/knowledge-blocks">Quản lý Khối Kiến Thức</Link>
            </li>
            <li>
              <Link to="/subjects">Quản lý Môn Học</Link>
            </li>
            <li>
              <Link to="/questions">Quản lý Câu Hỏi</Link>
            </li>
            <li>
              <Link to="/exam-structures">Quản lý Cấu Trúc Đề Thi</Link>
            </li>
            <li>
              <Link to="/exam-generator">Tạo Đề Thi</Link>
            </li>
          </ul>
        </nav>
        <div className="p-4">
          <Routes>
            <Route
              path="/knowledge-blocks"
              element={<KnowledgeBlockManager />}
            />
            <Route path="/subjects" element={<SubjectManager />} />
            <Route path="/questions" element={<QuestionManager />} />
            <Route path="/exam-structures" element={<ExamStructureManager />} />
            <Route path="/exam-generator" element={<ExamGenerator />} />
            <Route
              path="/"
              element={
                <div className="text-center">
                  Chào mừng đến với Hệ Thống Quản Lý Ngân Hàng Câu Hỏi
                </div>
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
