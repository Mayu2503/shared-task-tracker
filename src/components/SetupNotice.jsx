export default function SetupNotice() {
  return (
    <div className="setup">
      <div className="card setup-card">
        <h1>One more step ⚙️</h1>
        <p>
          The app can't find your Supabase settings. Create a file called <code>.env</code> in the
          project root (copy <code>.env.example</code>) and add:
        </p>
        <pre>{`VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key`}</pre>
        <p>Then stop the dev server (Ctrl+C) and run <code>npm run dev</code> again.</p>
      </div>
    </div>
  );
}
