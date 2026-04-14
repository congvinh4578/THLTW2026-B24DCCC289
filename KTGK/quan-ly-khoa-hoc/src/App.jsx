import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './pages/Dashboard';
import CourseList from './pages/CourseList';
import AddCourse from './pages/AddCourse';
import EditCourse from './pages/EditCourse';
import Statistics from './pages/Statistics';
import Toast from './components/Toast';

function App() {
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const closeToast = () => setToast(null);

  return (
    <Router>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />

        <div className="flex-1 ml-72">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/courses" element={<CourseList />} />
            <Route
              path="/courses/new"
              element={<AddCourse showToast={showToast} />}
            />
            <Route
              path="/courses/:id/edit"
              element={<EditCourse showToast={showToast} />}
            />
            <Route path="/statistics" element={<Statistics />} />
          </Routes>
        </div>

        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={closeToast}
          />
        )}
      </div>
    </Router>
  );
}

export default App;
