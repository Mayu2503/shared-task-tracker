function StatCard({ label, value, hint }) {
  return (
    <div className="stat card">
      <span className="stat-label">{label}</span>
      <span className="stat-value">{value}</span>
      <span className="stat-hint">{hint}</span>
    </div>
  );
}

export default function ProgressPanel({
  taskCount,
  completedCells,
  possible,
  percent,
  todayDay,
  todayDone,
  dailyCounts,
}) {
  return (
    <section className="progress" aria-label="Progress summary">
      <div className="stat-grid">
        <StatCard label="Tasks" value={taskCount} hint="active tasks" />
        <StatCard label="Completed" value={completedCells} hint={`of ${possible} possible`} />
        <StatCard
          label="Today"
          value={todayDay && taskCount ? `${todayDone}/${taskCount}` : '—'}
          hint={todayDay ? `November ${todayDay}` : 'Outside November'}
        />
        <StatCard label="Overall" value={`${percent}%`} hint="month progress" />
      </div>

      <div className="card overall">
        <div className="overall-head">
          <span>Month progress</span>
          <strong>{percent}%</strong>
        </div>
        <div
          className="bar-track"
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div className="bar-fill-main" style={{ width: `${percent}%` }} />
        </div>

        <h3 className="daily-title">Daily progress</h3>
        <div className="daily-bars">
          {dailyCounts.map((count, i) => {
            const day = i + 1;
            const pct = taskCount ? Math.round((count / taskCount) * 100) : 0;
            return (
              <div
                key={day}
                className={`daily-col ${day === todayDay ? 'is-today' : ''}`}
                title={`November ${day}: ${count}/${taskCount} done`}
              >
                <div className="daily-track">
                  <div className="daily-fill" style={{ height: `${pct}%` }} />
                </div>
                <span>{day}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
