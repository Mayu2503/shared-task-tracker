# Shared Task Tracker · November 2026

A shared task tracker for **Sritha** and **Mayuri**. Each person gets their own dashboard with a task table covering **November 1–30, 2026**, where every date has a checkbox. Tasks and ticks are saved to a shared **Supabase** (PostgreSQL) database, so both users see the same data from any device, updating live.

**Stack:** React 18 + Vite (frontend) · Supabase (database + realtime) · GitHub Pages (free hosting) · GitHub Actions (automatic deploys)

---

## What's inside

```
shared-task-tracker/
├── index.html
├── package.json
├── vite.config.js
├── .env.example                 ← template for your Supabase keys
├── .gitignore
├── supabase/
│   └── schema.sql               ← database tables, security rules, realtime
├── .github/workflows/deploy.yml ← auto-deploy to GitHub Pages
└── src/
    ├── main.jsx
    ├── App.jsx                  ← routing between the two dashboards
    ├── styles.css
    ├── lib/
    │   ├── supabase.js          ← Supabase client
    │   ├── tasks.js             ← all database reads/writes + realtime
    │   └── constants.js         ← users, quotes, date helpers
    └── components/
        ├── Dashboard.jsx        ← one dashboard (state, handlers, loading/errors)
        ├── TaskTable.jsx        ← task list, add/edit/delete, 30 day checkboxes
        ├── ProgressPanel.jsx    ← stats, progress bars, daily chart
        ├── Quote.jsx            ← rotating motivational quotes
        └── SetupNotice.jsx      ← friendly screen if .env is missing
```

Dashboards: `#/sritha` and `#/mayuri`. The navigation bar switches between them.

---

## Part 1 · Set up the database (Supabase, free)

1. Go to <https://supabase.com> and sign up (free).
2. Click **New project**. Choose a name (e.g. `task-tracker`), set a database password (save it somewhere), pick a region close to you, and click **Create new project**. Wait about a minute.
3. In the left sidebar, open **SQL Editor** → **New query**.
4. Open the file `supabase/schema.sql` from this project, copy **all** of it, paste it into the editor and click **Run**. You should see "Success. No rows returned".
5. Get your keys: click the **Project Settings** (gear icon) → **API**. Copy:
   - **Project URL** → this is `VITE_SUPABASE_URL`
   - **anon public** key (under *Project API keys*) → this is `VITE_SUPABASE_ANON_KEY`

> The anon key is designed to be public. Do **not** use the `service_role` key anywhere.

Realtime is turned on by the schema. If you ever want to confirm it: **Database → Replication** should list `tasks` and `task_completions` under `supabase_realtime`. The app also re-checks data every 30 seconds, so it stays in sync even without realtime.

---

## Part 2 · Run it in VS Code

### Prerequisites
- **Node.js 18 or newer** (LTS recommended): <https://nodejs.org>. Check with `node -v`.
- **VS Code**: <https://code.visualstudio.com>
- **Git** (for GitHub later): <https://git-scm.com>

### Steps
1. Unzip `shared-task-tracker.zip` somewhere easy to find (for example `Documents/shared-task-tracker`).
2. In VS Code: **File → Open Folder…** and select the `shared-task-tracker` folder.
3. Open the integrated terminal: **Terminal → New Terminal** (or `` Ctrl+` `` / `` Cmd+` ``).
4. Install dependencies:
   ```bash
   npm install
   ```
5. Create your environment file. Copy `.env.example` and rename the copy to `.env`:
   - Windows (PowerShell): `Copy-Item .env.example .env`
   - macOS / Linux: `cp .env.example .env`
6. Open `.env` in VS Code and paste your values:
   ```env
   VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOi...your-anon-key
   ```
   Save the file. Never commit `.env` to GitHub (it is already in `.gitignore`).
7. Start the app:
   ```bash
   npm run dev
   ```
8. Hold **Ctrl** (or **Cmd**) and click the `http://localhost:5173` link in the terminal. Open `#/sritha` and `#/mayuri` in two browser windows to see live sync.

### Other commands
| Command | What it does |
|---|---|
| `npm run dev` | Starts the development server with hot reload |
| `npm run build` | Creates a production build in `dist/` |
| `npm run preview` | Serves the production build locally to test it |

---

## Part 3 · Push to GitHub

1. Create a new **empty** repository on GitHub (e.g. `shared-task-tracker`). Do not add a README or .gitignore there.
2. In the VS Code terminal, inside the project folder:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: shared task tracker"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/shared-task-tracker.git
   git push -u origin main
   ```
   Check that `.env` is **not** listed by `git status` before pushing.

---

## Part 4 · Deploy to GitHub Pages

### 4a. Add your Supabase keys as repository secrets
1. On GitHub, open your repository → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**.
2. Create two secrets:
   - Name `VITE_SUPABASE_URL`, value = your Project URL
   - Name `VITE_SUPABASE_ANON_KEY`, value = your anon public key

### 4b. Turn on GitHub Pages with Actions
1. Repository → **Settings** → **Pages**.
2. Under **Build and deployment → Source**, choose **GitHub Actions**.

### 4c. Deploy
- Every push to `main` runs the workflow in `.github/workflows/deploy.yml` automatically. You can also run it manually: **Actions** tab → **Deploy to GitHub Pages** → **Run workflow**.
- When the run is green, your site is live at:
  `https://YOUR-USERNAME.github.io/shared-task-tracker/`
- Share the link with Sritha and Mayuri. Their dashboards are at `…/#/sritha` and `…/#/mayuri`.

Both users can open the same link on any device. Changes sync through Supabase.

---

## Security notes

- This app has **no login**. The schema allows anyone with the link to read and edit the tasks. That is a reasonable trade-off for two people, but do not store private or sensitive information in it.
- If you want to restrict access later, add Supabase Auth (email magic links) and tighten the RLS policies in `schema.sql`.

---

## Troubleshooting

| Symptom | Fix |
|---|---|
| Setup screen says settings are missing | Check that `.env` exists in the project root with both variables, then restart `npm run dev`. |
| "Failed to fetch" or "Invalid API key" | Re-copy the Project URL and **anon** key from Supabase → Settings → API. |
| "relation public.tasks does not exist" | The SQL schema did not run. Run `supabase/schema.sql` again in the SQL Editor. |
| Changes don't appear live on the other device | Check **Database → Replication** in Supabase. The 30-second refresh still works either way. |
| Deployed site is blank | Confirm both GitHub secrets are set, then re-run the workflow. Check that Pages source is **GitHub Actions**. |
| Page shows 404 on GitHub Pages | Use the full link including the repo name, e.g. `/shared-task-tracker/#/sritha`. |
