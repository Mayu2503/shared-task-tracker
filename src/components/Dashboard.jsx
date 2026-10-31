import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  fetchTasks,
  addTask,
  renameTask,
  removeTask,
  setDayCompletion,
  subscribeToChanges,
} from '../lib/tasks.js';
import { USERS, DAYS, MONTH_LABEL, todayDayOfNovember } from '../lib/constants.js';
import TaskTable from './TaskTable.jsx';
import ProgressPanel from './ProgressPanel.jsx';
import Quote from './Quote.jsx';

const MONTH_DAYS = DAYS.length;

export default function Dashboard({ owner }) {
  const user = USERS.find((u) => u.key === owner);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      const data = await fetchTasks(owner);
      setTasks(data);
      setError('');
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [owner]);

  useEffect(() => {
    setLoading(true);
    load();
    return subscribeToChanges(load);
  }, [load]);

  const handleAdd = async (title) => {
    setAdding(true);
    try {
      const row = await addTask(owner, title);
      setTasks((prev) => [...prev, { id: row.id, title: row.title, days: [] }]);
      return true;
    } catch (e) {
      setError(`Could not add task: ${e.message}`);
      return false;
    } finally {
      setAdding(false);
    }
  };

  const handleToggle = async (taskId, day, completed) => {
    // Optimistic update: the checkbox responds instantly, then saves.
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const days = completed
          ? [...new Set([...t.days, day])]
          : t.days.filter((d) => d !== day);
        return { ...t, days };
      })
    );
    try {
      await setDayCompletion(taskId, day, completed);
    } catch (e) {
      setError(`Could not save that tick: ${e.message}`);
      load();
    }
  };

  const handleRename = async (taskId, title) => {
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, title } : t)));
    try {
      await renameTask(taskId, title);
    } catch (e) {
      setError(`Could not rename task: ${e.message}`);
      load();
    }
  };

  const handleDelete = async (task) => {
    if (!window.confirm(`Delete "${task.title}" and all its ticks?`)) return;
    setTasks((prev) => prev.filter((t) => t.id !== task.id));
    try {
      await removeTask(task.id);
    } catch (e) {
      setError(`Could not delete task: ${e.message}`);
      load();
    }
  };

  const stats = useMemo(() => {
    const taskCount = tasks.length;
    const completedCells = tasks.reduce((sum, t) => sum + t.days.length, 0);
    const possible = taskCount * MONTH_DAYS;
    const percent = possible ? Math.round((completedCells / possible) * 100) : 0;
    const todayDay = todayDayOfNovember();
    const todayDone = todayDay ? tasks.filter((t) => t.days.includes(todayDay)).length : 0;
    const dailyCounts = DAYS.map((d) => tasks.filter((t) => t.days.includes(d)).length);
    return { taskCount, completedCells, possible, percent, todayDay, todayDone, dailyCounts };
  }, [tasks]);

  return (
    <div className="dashboard">
      <header className="hero card">
        <div>
          <p className="eyebrow">{MONTH_LABEL}</p>
          <h1>{user.name}'s Tracker</h1>
          <p className="hero-sub">
            {stats.taskCount === 0
              ? 'Plan your month, one task at a time.'
              : `${stats.completedCells} ticks so far. Keep going!`}
          </p>
        </div>
        <div className="hero-emoji" aria-hidden="true">{user.emoji}</div>
      </header>

      <Quote />

      {error && (
        <div className="alert" role="alert">
          <span>{error}</span>
          <button className="icon-btn" onClick={() => setError('')} aria-label="Dismiss error">✕</button>
        </div>
      )}

      {loading ? (
        <div className="loading" role="status">
          <span className="spinner" aria-hidden="true" /> Loading {user.name}'s tasks…
        </div>
      ) : (
        <>
          <ProgressPanel {...stats} />
          <TaskTable
            tasks={tasks}
            adding={adding}
            onAdd={handleAdd}
            onToggle={handleToggle}
            onRename={handleRename}
            onDelete={handleDelete}
          />
        </>
      )}
    </div>
  );
}
