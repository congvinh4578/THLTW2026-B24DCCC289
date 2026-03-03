import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import './App.css';

interface Subject {
  id: string;
  name: string;
}

interface StudyLog {
  id: string;
  subjectId: string;
  date: string;
  duration: number; 
  content: string;
  notes: string;
}

interface Goal {
  id: string;
  month: string; 
  subjectId: string | null; 
  targetDuration: number; 
}

const calculateAchieved = (logs: StudyLog[], month: string, subjectId: string | null = null) => {
  const start = new Date(`${month}-01`);
  const end = new Date(start.getFullYear(), start.getMonth() + 1, 0, 23, 59, 59);
  
  return logs
    .filter(log => {
      const logDate = new Date(log.date);
      return logDate >= start && logDate <= end && (subjectId ? log.subjectId === subjectId : true);
    })
    .reduce((total, log) => total + log.duration, 0);
};

function App() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [studyLogs, setStudyLogs] = useState<StudyLog[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [editSubjectId, setEditSubjectId] = useState<string | null>(null);
  const [editSubjectName, setEditSubjectName] = useState('');

  const [newLog, setNewLog] = useState<Omit<StudyLog, 'id' | 'subjectId'>>({
    date: new Date().toISOString().slice(0, 16),
    duration: 0,
    content: '',
    notes: '',
  });
  const [editLogId, setEditLogId] = useState<string | null>(null);

  const [newGoal, setNewGoal] = useState<Omit<Goal, 'id'>>({
    month: new Date().toISOString().slice(0, 7),
    subjectId: null,
    targetDuration: 0,
  });
  const [editGoalId, setEditGoalId] = useState<string | null>(null);


  useEffect(() => {
    const savedSubjects = localStorage.getItem('subjects');
    const savedLogs = localStorage.getItem('studyLogs');
    const savedGoals = localStorage.getItem('goals');
    if (savedSubjects) setSubjects(JSON.parse(savedSubjects));
    if (savedLogs) setStudyLogs(JSON.parse(savedLogs));
    if (savedGoals) setGoals(JSON.parse(savedGoals));
  }, []);


  useEffect(() => {
    localStorage.setItem('subjects', JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem('studyLogs', JSON.stringify(studyLogs));
  }, [studyLogs]);

  useEffect(() => {
    localStorage.setItem('goals', JSON.stringify(goals));
  }, [goals]);

  const handleAddOrEditSubject = () => {
    if (editSubjectId) {
      setSubjects(subjects.map(sub => sub.id === editSubjectId ? { ...sub, name: editSubjectName } : sub));
      setEditSubjectId(null);
      setEditSubjectName('');
    } else if (newSubjectName.trim()) {
      setSubjects([...subjects, { id: uuidv4(), name: newSubjectName.trim() }]);
      setNewSubjectName('');
    }
  };

  const handleEditSubject = (sub: Subject) => {
    setEditSubjectId(sub.id);
    setEditSubjectName(sub.name);
  };

  const handleDeleteSubject = (id: string) => {
    setSubjects(subjects.filter(sub => sub.id !== id));
    setStudyLogs(studyLogs.filter(log => log.subjectId !== id));
    setGoals(goals.filter(goal => goal.subjectId !== id));
    if (selectedSubject === id) setSelectedSubject(null);
  };


  const handleAddOrEditLog = () => {
    if (!selectedSubject) return;

    if (editLogId) {
      setStudyLogs(studyLogs.map(log => log.id === editLogId ? { ...log, ...newLog } : log));
      setEditLogId(null);
    } else {
      setStudyLogs([...studyLogs, { id: uuidv4(), subjectId: selectedSubject, ...newLog }]);
    }
    setNewLog({ date: new Date().toISOString().slice(0, 16), duration: 0, content: '', notes: '' });
  };

  const handleEditLog = (log: StudyLog) => {
    setEditLogId(log.id);
    setNewLog({ date: log.date, duration: log.duration, content: log.content, notes: log.notes });
  };

  const handleDeleteLog = (id: string) => {
    setStudyLogs(studyLogs.filter(log => log.id !== id));
  };


  const handleAddOrEditGoal = () => {
    if (editGoalId) {
      setGoals(goals.map(goal => goal.id === editGoalId ? { ...goal, ...newGoal } : goal));
      setEditGoalId(null);
    } else {
      setGoals([...goals, { id: uuidv4(), ...newGoal }]);
    }
    setNewGoal({ month: new Date().toISOString().slice(0, 7), subjectId: null, targetDuration: 0 });
  };

  const handleEditGoal = (goal: Goal) => {
    setEditGoalId(goal.id);
    setNewGoal({ month: goal.month, subjectId: goal.subjectId, targetDuration: goal.targetDuration });
  };

  const handleDeleteGoal = (id: string) => {
    setGoals(goals.filter(goal => goal.id !== id));
  };


  const selectedLogs = studyLogs.filter(log => log.subjectId === selectedSubject);


  const uniqueMonths = [...new Set(goals.map(g => g.month))].sort().reverse();

  return (
    <div className="app">
      <h1>Ứng Dụng Theo Dõi Học Tập</h1>
      <section className="section">
        <h2>Quản Lý Môn Học</h2>
        <div className="form">
          <input
            type="text"
            value={editSubjectId ? editSubjectName : newSubjectName}
            onChange={e => editSubjectId ? setEditSubjectName(e.target.value) : setNewSubjectName(e.target.value)}
            placeholder="Tên môn học..."
          />
          <button onClick={handleAddOrEditSubject}>
            {editSubjectId ? 'Sửa' : 'Thêm'}
          </button>
        </div>
        <ul className="list">
          {subjects.map(sub => (
            <li key={sub.id}>
              <span onClick={() => setSelectedSubject(sub.id)} className={selectedSubject === sub.id ? 'selected' : ''}>
                {sub.name}
              </span>
              <div>
                <button onClick={() => handleEditSubject(sub)}>Sửa</button>
                <button onClick={() => handleDeleteSubject(sub.id)}>Xóa</button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {selectedSubject && (
        <section className="section">
          <h2>Tiến Độ Học Tập: {subjects.find(sub => sub.id === selectedSubject)?.name}</h2>
          <div className="form">
            <input
              type="datetime-local"
              value={newLog.date}
              onChange={e => setNewLog({ ...newLog, date: e.target.value })}
            />
            <input
              type="number"
              value={newLog.duration}
              onChange={e => setNewLog({ ...newLog, duration: parseInt(e.target.value) || 0 })}
              placeholder="Thời lượng (phút)"
            />
            <input
              value={newLog.content}
              onChange={e => setNewLog({ ...newLog, content: e.target.value })}
              placeholder="Nội dung học..."
            />
            <input
              value={newLog.notes}
              onChange={e => setNewLog({ ...newLog, notes: e.target.value })}
              placeholder="Ghi chú..."
            />
            <button onClick={handleAddOrEditLog}>
              {editLogId ? 'Sửa' : 'Thêm'}
            </button>
          </div>
          <ul className="list">
            {selectedLogs.map(log => (
              <li key={log.id}>
                <span>
                  {new Date(log.date).toLocaleString()} - {log.duration} phút - {log.content} ({log.notes})
                </span>
                <div>
                  <button onClick={() => handleEditLog(log)}>Sửa</button>
                  <button onClick={() => handleDeleteLog(log.id)}>Xóa</button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
      <section className="section">
        <h2>Quản Lý Mục Tiêu Hàng Tháng</h2>
        <div className="form">
          <input
            type="month"
            value={newGoal.month}
            onChange={e => setNewGoal({ ...newGoal, month: e.target.value })}
          />
          <select
            value={newGoal.subjectId || ''}
            onChange={e => setNewGoal({ ...newGoal, subjectId: e.target.value || null })}
          >
            <option value="">Tổng thời lượng</option>
            {subjects.map(sub => (
              <option key={sub.id} value={sub.id}>{sub.name}</option>
            ))}
          </select>
          <input
            type="number"
            value={newGoal.targetDuration}
            onChange={e => setNewGoal({ ...newGoal, targetDuration: parseInt(e.target.value) || 0 })}
            placeholder="Mục tiêu (phút)"
          />
          <button onClick={handleAddOrEditGoal}>
            {editGoalId ? 'Sửa' : 'Thêm'}
          </button>
        </div>
        {uniqueMonths.map(month => (
          <div key={month} className="month-group">
            <h3>Tháng {month}</h3>
            <ul className="list">
              {goals.filter(g => g.month === month).map(goal => {
                const achieved = calculateAchieved(studyLogs, month, goal.subjectId);
                const status = achieved >= goal.targetDuration ? 'Hoàn thành ✅' : 'Chưa đạt ❌';
                return (
                  <li key={goal.id}>
                    <span>
                      {goal.subjectId ? subjects.find(sub => sub.id === goal.subjectId)?.name : 'Tổng'} - Mục tiêu: {goal.targetDuration} phút - Đạt: {achieved} phút - {status}
                    </span>
                    <div>
                      <button onClick={() => handleEditGoal(goal)}>Sửa</button>
                      <button onClick={() => handleDeleteGoal(goal.id)}>Xóa</button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </section>
    </div>
  );
}

export default App;