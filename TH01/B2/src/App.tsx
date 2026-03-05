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

interface MonthlyGoal {
  id: string;
  month: string;          
  subjectId: string | null; 
  targetMinutes: number;
}

function getAchievedMinutes(
  logs: StudyLog[],
  targetMonth: string,
  subjectId?: string
): number {
  const [year, month] = targetMonth.split('-').map(Number);
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0, 23, 59, 59);

  return logs
    .filter((log) => {
      const logDate = new Date(log.date);
      return (
        logDate >= start &&
        logDate <= end &&
        (!subjectId || log.subjectId === subjectId)
      );
    })
    .reduce((sum, log) => sum + log.duration, 0);
}

function App() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [logs, setLogs] = useState<StudyLog[]>([]);
  const [goals, setGoals] = useState<MonthlyGoal[]>([]);

  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);

  const [newSubjectName, setNewSubjectName] = useState('');
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

  const [logForm, setLogForm] = useState({
    date: new Date().toISOString().slice(0, 16),
    duration: '',
    content: '',
    notes: '',
  });
  const [editingLog, setEditingLog] = useState<StudyLog | null>(null);

  const [goalForm, setGoalForm] = useState({
    month: new Date().toISOString().slice(0, 7),
    subjectId: '' as string | null,
    targetMinutes: '',
  });
  const [editingGoal, setEditingGoal] = useState<MonthlyGoal | null>(null);

  useEffect(() => {
    const saved = {
      subjects: localStorage.getItem('subjects'),
      logs: localStorage.getItem('studyLogs'),
      goals: localStorage.getItem('monthlyGoals'),
    };
    if (saved.subjects) setSubjects(JSON.parse(saved.subjects));
    if (saved.logs) setLogs(JSON.parse(saved.logs));
    if (saved.goals) setGoals(JSON.parse(saved.goals));
  }, []);

  useEffect(() => {
    localStorage.setItem('subjects', JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem('studyLogs', JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    localStorage.setItem('monthlyGoals', JSON.stringify(goals));
  }, [goals]);

  const handleSaveSubject = () => {
    const name = (editingSubject ? editingSubject.name : newSubjectName).trim();
    if (!name) return alert('Vui lòng nhập tên môn học');

    const isDuplicate = subjects.some(
      (s) => s.name.toLowerCase() === name.toLowerCase() && s.id !== editingSubject?.id
    );
    if (isDuplicate) return alert('Môn học này đã tồn tại!');

    if (editingSubject) {
      setSubjects(subjects.map((s) => (s.id === editingSubject.id ? { ...s, name } : s)));
      setEditingSubject(null);
    } else {
      setSubjects([...subjects, { id: uuidv4(), name }]);
    }
    setNewSubjectName('');
  };

  const startEditSubject = (sub: Subject) => {
    setEditingSubject(sub);
    setNewSubjectName(sub.name);
  };

  const deleteSubject = (id: string) => {
    if (!confirm('Xóa môn học này sẽ xóa hết lịch học và mục tiêu liên quan. Tiếp tục?')) return;
    setSubjects(subjects.filter((s) => s.id !== id));
    setLogs(logs.filter((l) => l.subjectId !== id));
    setGoals(goals.filter((g) => g.subjectId !== id));
    if (selectedSubjectId === id) setSelectedSubjectId(null);
  };

  const handleSaveLog = () => {
    if (!selectedSubjectId) return alert('Vui lòng chọn môn học trước');

    const durationNum = parseInt(logForm.duration);
    if (isNaN(durationNum) || durationNum <= 0) return alert('Thời lượng phải là số dương');

    const logData = {
      date: logForm.date,
      duration: durationNum,
      content: logForm.content.trim(),
      notes: logForm.notes.trim(),
    };

    if (editingLog) {
      setLogs(
        logs.map((l) =>
          l.id === editingLog.id ? { ...l, ...logData } : l
        )
      );
      setEditingLog(null);
    } else {
      setLogs([
        ...logs,
        { id: uuidv4(), subjectId: selectedSubjectId, ...logData },
      ]);
    }

    setLogForm({
      date: new Date().toISOString().slice(0, 16),
      duration: '',
      content: '',
      notes: '',
    });
  };

  const startEditLog = (log: StudyLog) => {
    setEditingLog(log);
    setLogForm({
      date: log.date.slice(0, 16),
      duration: log.duration.toString(),
      content: log.content,
      notes: log.notes,
    });
  };

  const deleteLog = (id: string) => {
    if (!confirm('Xóa lịch học này?')) return;
    setLogs(logs.filter((l) => l.id !== id));
  };
  const handleSaveGoal = () => {
    const minutes = parseInt(goalForm.targetMinutes);
    if (isNaN(minutes) || minutes <= 0) return alert('Mục tiêu phải là số dương');

    const goalData = {
      month: goalForm.month,
      subjectId: goalForm.subjectId || null,
      targetMinutes: minutes,
    };

    if (editingGoal) {
      setGoals(
        goals.map((g) =>
          g.id === editingGoal.id ? { ...g, ...goalData } : g
        )
      );
      setEditingGoal(null);
    } else {
      const duplicate = goals.some(
        (g) =>
          g.month === goalForm.month &&
          g.subjectId === (goalForm.subjectId || null)
      );
      if (duplicate) return alert('Đã có mục tiêu cho tháng/môn này rồi!');

      setGoals([...goals, { id: uuidv4(), ...goalData }]);
    }

    setGoalForm({
      month: new Date().toISOString().slice(0, 7),
      subjectId: '',
      targetMinutes: '',
    });
  };

  const startEditGoal = (goal: MonthlyGoal) => {
    setEditingGoal(goal);
    setGoalForm({
      month: goal.month,
      subjectId: goal.subjectId || '',
      targetMinutes: goal.targetMinutes.toString(),
    });
  };

  const deleteGoal = (id: string) => {
    if (!confirm('Xóa mục tiêu này?')) return;
    setGoals(goals.filter((g) => g.id !== id));
  };

  const currentSubjectName = subjects.find((s) => s.id === selectedSubjectId)?.name || '';

  const uniqueGoalMonths = [...new Set(goals.map((g) => g.month))].sort().reverse();

  return (
    <div className="app">
      <header>
        <h1>Theo Dõi Tiến Độ Học Tập</h1>
      </header>

      <main>
        <section className="card">
          <h2>Danh Mục Môn Học</h2>
          <div className="form-row">
            <input
              type="text"
              placeholder="Tên môn học (Toán, Lý, Hóa...)"
              value={editingSubject ? editingSubject.name : newSubjectName}
              onChange={(e) =>
                editingSubject
                  ? setEditingSubject({ ...editingSubject, name: e.target.value })
                  : setNewSubjectName(e.target.value)
              }
            />
            <button onClick={handleSaveSubject}>
              {editingSubject ? 'Lưu sửa' : 'Thêm môn'}
            </button>
            {editingSubject && (
              <button className="secondary" onClick={() => setEditingSubject(null)}>
                Hủy
              </button>
            )}
          </div>

          <ul className="subject-list">
            {subjects.length === 0 ? (
              <p className="empty">Chưa có môn học nào</p>
            ) : (
              subjects.map((sub) => (
                <li key={sub.id} className={selectedSubjectId === sub.id ? 'active' : ''}>
                  <span onClick={() => setSelectedSubjectId(sub.id)}>{sub.name}</span>
                  <div className="actions">
                    <button className="edit" onClick={() => startEditSubject(sub)}>
                      Sửa
                    </button>
                    <button className="delete" onClick={() => deleteSubject(sub.id)}>
                      Xóa
                    </button>
                  </div>
                </li>
              ))
            )}
          </ul>
        </section>

        {selectedSubjectId && (
          <section className="card">
            <h2>Tiến độ: {currentSubjectName}</h2>

            <div className="form-grid">
              <input
                type="datetime-local"
                value={logForm.date}
                onChange={(e) => setLogForm({ ...logForm, date: e.target.value })}
              />
              <input
                type="number"
                placeholder="Thời lượng (phút)"
                min="1"
                value={logForm.duration}
                onChange={(e) => setLogForm({ ...logForm, duration: e.target.value })}
              />
              <input
                placeholder="Nội dung đã học"
                value={logForm.content}
                onChange={(e) => setLogForm({ ...logForm, content: e.target.value })}
              />
              <input
                placeholder="Ghi chú"
                value={logForm.notes}
                onChange={(e) => setLogForm({ ...logForm, notes: e.target.value })}
              />
              <button onClick={handleSaveLog}>
                {editingLog ? 'Cập nhật log' : 'Thêm buổi học'}
              </button>
              {editingLog && (
                <button className="secondary" onClick={() => setEditingLog(null)}>
                  Hủy
                </button>
              )}
            </div>

            <div className="log-list">
              {logs.filter((l) => l.subjectId === selectedSubjectId).length === 0 ? (
                <p className="empty">Chưa có buổi học nào cho môn này</p>
              ) : (
                logs
                  .filter((l) => l.subjectId === selectedSubjectId)
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((log) => (
                    <div key={log.id} className="log-item">
                      <div className="log-info">
                        <time>{new Date(log.date).toLocaleString('vi-VN')}</time>
                        <strong>{log.duration} phút</strong>
                        <div>{log.content}</div>
                        {log.notes && <small>{log.notes}</small>}
                      </div>
                      <div className="actions">
                        <button className="edit" onClick={() => startEditLog(log)}>
                          Sửa
                        </button>
                        <button className="delete" onClick={() => deleteLog(log.id)}>
                          Xóa
                        </button>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </section>
        )}
        <section className="card">
          <h2>Mục tiêu học tập hàng tháng</h2>

          <div className="form-grid">
            <input
              type="month"
              value={goalForm.month}
              onChange={(e) => setGoalForm({ ...goalForm, month: e.target.value })}
            />
            <select
              value={goalForm.subjectId ?? ''}
              onChange={(e) => setGoalForm({ ...goalForm, subjectId: e.target.value || null })}
            >
              <option value="">→ Tổng thời lượng tháng</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Mục tiêu (phút)"
              min="1"
              value={goalForm.targetMinutes}
              onChange={(e) => setGoalForm({ ...goalForm, targetMinutes: e.target.value })}
            />
            <button onClick={handleSaveGoal}>
              {editingGoal ? 'Cập nhật mục tiêu' : 'Thêm mục tiêu'}
            </button>
            {editingGoal && (
              <button className="secondary" onClick={() => setEditingGoal(null)}>
                Hủy
              </button>
            )}
          </div>

          {uniqueGoalMonths.length === 0 ? (
            <p className="empty">Chưa có mục tiêu nào</p>
          ) : (
            uniqueGoalMonths.map((month) => {
              const monthGoals = goals.filter((g) => g.month === month);
              return (
                <div key={month} className="month-group">
                  <h3>Tháng {month}</h3>
                  {monthGoals.map((goal) => {
                    const achieved = getAchievedMinutes(logs, month, goal.subjectId ?? undefined);
                    const isCompleted = achieved >= goal.targetMinutes;
                    const subjectName = goal.subjectId
                      ? subjects.find((s) => s.id === goal.subjectId)?.name || '?'
                      : 'TỔNG';

                    return (
                      <div key={goal.id} className={`goal-item ${isCompleted ? 'completed' : 'pending'}`}>
                        <div className="goal-info">
                          <strong>{subjectName}</strong>
                          <div>
                            Mục tiêu: <b>{goal.targetMinutes.toLocaleString()} phút</b> — Đạt:{' '}
                            <b>{achieved.toLocaleString()} phút</b>
                          </div>
                          <div className="status">
                            {isCompleted ? 'Hoàn thành ✓' : `Còn thiếu ${goal.targetMinutes - achieved} phút`}
                          </div>
                        </div>
                        <div className="actions">
                          <button className="edit" onClick={() => startEditGoal(goal)}>
                            Sửa
                          </button>
                          <button className="delete" onClick={() => deleteGoal(goal.id)}>
                            Xóa
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })
          )}
        </section>
      </main>
    </div>
  );
}

export default App;