import { createClient } from "@/lib/supabase/server";
import { Suspense } from "react";

async function InstrumentsData() {
    // await createClient() works even if the function is sync (resolves to value)
    // This matches the Supabase guide's snippet exactly.
    const supabase = await createClient();
    const { data: instruments } = await supabase.from("instruments").select();

    return <pre className="bg-gray-100 p-4 rounded">{JSON.stringify(instruments, null, 2)}</pre>;
}

export default function Instruments() {
    return (
        <div className="p-8 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Instruments (Supabase Quickstart)</h1>
            <p className="mb-4 text-gray-600">
                This page demonstrates fetching data from Supabase following the official Next.js Quickstart guide.
                It uses the same code structure but leverages our Clerk integration under the hood.
            </p>
            <Suspense fallback={<div>Loading instruments...</div>}>
                <InstrumentsData />
            </Suspense>
        </div>
    );
}
