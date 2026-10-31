import { useState } from 'react';
import { DAYS, todayDayOfNovember } from '../lib/constants.js';

export default function TaskTable({ tasks, onAdd, onToggle, onRename, onDelete, adding }) {
  const [newTitle, setNewTitle] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const today = todayDayOfNovember();

  const submitNew = async (e) => {
    e.preventDefault();
    const title = newTitle.trim();
    if (!title || adding) return;
    const ok = await onAdd(title);
    if (ok) setNewTitle('');
  };

  const startEdit = (task) => {
    setEditingId(task.id);
    setEditValue(task.title);
  };

  const saveEdit = async (task) => {
    const title = editValue.trim();
    setEditingId(null);
    if (!title || title === task.title) return;
    await onRename(task.id, title);
  };

  return (
    <section className="card tasks">
      <form className="add-form" onSubmit={submitNew}>
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Add a new task…"
          maxLength={120}
          aria-label="New task name"
          disabled={adding}
        />
        <button type="submit" className="btn primary" disabled={!newTitle.trim() || adding}>
          {adding ? 'Adding…' : 'Add task'}
        </button>
      </form>

      <div className="table-wrap">
        <table className="task-table">
          <thead>
            <tr>
              <th scope="col" className="task-col">Task</th>
              {DAYS.map((d) => (
                <th
                  key={d}
                  scope="col"
                  className={d === today ? 'today' : ''}
                  title={`November ${d}`}
                >
                  {d}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tasks.length === 0 && (
              <tr>
                <td colSpan={DAYS.length + 1} className="empty">
                  No tasks yet. Add your first one above ✨
                </td>
              </tr>
            )}
            {tasks.map((task) => (
              <tr key={task.id} className="task-row">
                <th scope="row" className="task-col">
                  {editingId === task.id ? (
                    <div className="edit-row">
                      <input
                        autoFocus
                        value={editValue}
                        maxLength={120}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') saveEdit(task);
                          if (e.key === 'Escape') setEditingId(null);
                        }}
                        aria-label="Edit task name"
                      />
                      <button className="icon-btn" onClick={() => saveEdit(task)} aria-label="Save task name">✓</button>
                      <button className="icon-btn" onClick={() => setEditingId(null)} aria-label="Cancel edit">✕</button>
                    </div>
                  ) : (
                    <div className="task-name">
                      <div className="task-text">
                        <span className="task-title">{task.title}</span>
                        <span className="task-count">{task.days.length}/30 days</span>
                      </div>
                      <div className="task-actions">
                        <button className="icon-btn" onClick={() => startEdit(task)} aria-label={`Edit ${task.title}`}>✎</button>
                        <button className="icon-btn danger" onClick={() => onDelete(task)} aria-label={`Delete ${task.title}`}>🗑</button>
                      </div>
                    </div>
                  )}
                </th>
                {DAYS.map((d) => (
                  <td key={d} className={d === today ? 'today' : ''}>
                    <input
                      type="checkbox"
                      checked={task.days.includes(d)}
                      onChange={(e) => onToggle(task.id, d, e.target.checked)}
                      aria-label={`${task.title}, November ${d}`}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
