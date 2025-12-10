import { createClerkSupabaseClient } from '@/lib/supabase/server';
import { ClientDemo } from './client-demo';
import { currentUser } from '@clerk/nextjs/server';

export default async function DemoPage() {
    const user = await currentUser();
    const client = createClerkSupabaseClient();

    // Example: Fetch todos (assuming table exists)
    const { data: todos, error } = await client.from('todos').select('*');

    return (
        <div className="p-8 space-y-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold">Supabase + Clerk Integration Demo</h1>
            <p className="text-gray-600">
                This page demonstrates the integration of Supabase and Clerk using the "Native Integration" pattern (Post-April 2025).
            </p>

            <section className="space-y-4 border p-6 rounded-lg">
                <h2 className="text-xl font-semibold">Server-Side Fetching (RSC)</h2>
                <p>Current User ID (Clerk): <code className="bg-gray-100 px-2 py-1 rounded">{user?.id}</code></p>
                {error ? (
                    <div className="p-4 bg-red-100 text-red-700 rounded">
                        <p className="font-bold">Error fetching todos:</p>
                        <p>{error.message}</p>
                        <p className="mt-2 text-sm">
                            Note: You need to create the 'todos' table and enable RLS.
                            See <code>supabase/migrations/20250401_clerk_integration.sql</code>.
                        </p>
                    </div>
                ) : (
                    <div>
                        <p className="mb-2">Data fetched from server:</p>
                        <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-60">
                            {JSON.stringify(todos, null, 2)}
                        </pre>
                    </div>
                )}
            </section>

            <section className="space-y-4 border p-6 rounded-lg">
                <h2 className="text-xl font-semibold">Client-Side Fetching</h2>
                <ClientDemo />
            </section>
        </div>
    );
}
