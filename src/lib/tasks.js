import { supabase } from './supabase.js';

function db() {
  if (!supabase) {
    throw new Error('Supabase is not configured. Add your keys to the .env file and restart the dev server.');
  }
  return supabase;
}

function friendly(error) {
  return new Error(error?.message || 'Something went wrong while talking to the database.');
}

/** Loads all tasks for one owner, with the completed day numbers for each task. */
export async function fetchTasks(owner) {
  const { data, error } = await db()
    .from('tasks')
    .select('id, title, created_at, task_completions(day, completed)')
    .eq('owner', owner)
    .order('created_at', { ascending: true });

  if (error) throw friendly(error);

  return data.map((t) => ({
    id: t.id,
    title: t.title,
    days: (t.task_completions || []).filter((c) => c.completed).map((c) => c.day),
  }));
}

export async function addTask(owner, title) {
  const { data, error } = await db()
    .from('tasks')
    .insert({ owner, title })
    .select('id, title')
    .single();
  if (error) throw friendly(error);
  return data;
}

export async function renameTask(id, title) {
  const { error } = await db().from('tasks').update({ title }).eq('id', id);
  if (error) throw friendly(error);
}

export async function removeTask(id) {
  const { error } = await db().from('tasks').delete().eq('id', id);
  if (error) throw friendly(error);
}

export async function setDayCompletion(taskId, day, completed) {
  const { error } = await db()
    .from('task_completions')
    .upsert(
      { task_id: taskId, day, completed, updated_at: new Date().toISOString() },
      { onConflict: 'task_id,day' }
    );
  if (error) throw friendly(error);
}

/**
 * Calls onChange when the shared database changes (realtime), and every 30s as a
 * safety net. Returns a cleanup function.
 */
export function subscribeToChanges(onChange) {
  if (!supabase) return () => {};

  let timer;
  const trigger = () => {
    clearTimeout(timer);
    timer = setTimeout(onChange, 150);
  };

  const channel = supabase
    .channel(`tracker-${Math.random().toString(36).slice(2)}`)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, trigger)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'task_completions' }, trigger)
    .subscribe((status) => {
      if (status === 'CHANNEL_ERROR') {
        console.warn('Realtime channel error. Polling will keep data fresh.');
      }
    });

  const poll = setInterval(onChange, 30000);

  return () => {
    clearTimeout(timer);
    clearInterval(poll);
    supabase.removeChannel(channel);
  };
}
