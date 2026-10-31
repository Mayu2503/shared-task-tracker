import { useEffect, useState } from 'react';
import Dashboard from './components/Dashboard.jsx';
import SetupNotice from './components/SetupNotice.jsx';
import { isConfigured } from './lib/supabase.js';
import { USERS } from './lib/constants.js';

function getRouteFromHash() {
  const key = window.location.hash.replace(/^#\/?/, '').toLowerCase();
  return USERS.some((u) => u.key === key) ? key : USERS[0].key;
}

function useRoute() {
  const [route, setRoute] = useState(getRouteFromHash);
  useEffect(() => {
    const onChange = () => setRoute(getRouteFromHash());
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return route;
}

export default function App() {
  const route = useRoute();

  if (!isConfigured) return <SetupNotice />;

  return (
    <div className="app" data-owner={route}>
      <nav className="nav" aria-label="Dashboards">
        <div className="brand">✦ Task Tracker</div>
        <div className="switcher">
          {USERS.map((u) => (
            <a
              key={u.key}
              href={`#/${u.key}`}
              className={`switch-link ${route === u.key ? 'active' : ''}`}
              aria-current={route === u.key ? 'page' : undefined}
            >
              <span aria-hidden="true">{u.emoji}</span> {u.name}
            </a>
          ))}
        </div>
      </nav>

      <main key={route} className="page">
        <Dashboard owner={route} />
      </main>

      <footer className="footer">Changes sync live across devices · November 2026</footer>
    </div>
  );
}
