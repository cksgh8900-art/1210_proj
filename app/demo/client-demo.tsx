'use client';

import { useClerkSupabaseClient } from '@/lib/supabase/clerk-client';
import { useEffect, useState } from 'react';

export function ClientDemo() {
  const client = useClerkSupabaseClient();
  const [todos, setTodos] = useState<any[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    fetchTodos();
  }, [client]);

  async function fetchTodos() {
    const { data, error } = await client.from('todos').select('*');
    if (error) {
      setError(error.message);
    } else {
      setTodos(data);
    }
  }

  async function addTodo(e: React.FormEvent) {
    e.preventDefault();
    if (!newTask.trim()) return;

    // We don't need to pass user_id manually if we set it default in DB or handle it in trigger
    // But usually we pass it. 
    // However, we can get it from the session.
    // Ideally, the DB should set it automatically from auth.jwt() ->> 'sub' using a trigger or default value.
    // But for simplicity, we'll let the user pass it? 
    // No, RLS 'with check' requires it to match.
    // So we must pass it.
    // But wait, we don't have the user ID easily here unless we use useUser().
    
    // Let's use useUser.
    // But wait, the client is already authenticated.
    // If we use a default value in Postgres: `default (auth.jwt() ->> 'sub')`, that would be best practice.
    // I will update the SQL to include that default.
    
    const { error } = await client.from('todos').insert({ task: newTask });
    
    if (error) {
      alert('Error adding todo: ' + error.message);
    } else {
      setNewTask('');
      fetchTodos();
    }
  }

  if (error) {
    return <div className="text-red-500">Client Error: {error}</div>;
  }

  return (
    <div className="space-y-4">
      <form onSubmit={addTodo} className="flex gap-2">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="New task..."
          className="border p-2 rounded"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Add</button>
      </form>

      {!todos ? (
        <div>Loading client data...</div>
      ) : (
        <pre className="bg-gray-100 p-4 rounded overflow-auto">
          {JSON.stringify(todos, null, 2)}
        </pre>
      )}
    </div>
  );
}
