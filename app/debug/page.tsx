"use client"

import { useEffect, useState } from 'react'

export default function DebugPage() {
    const [envStatus, setEnvStatus] = useState<any>(null)

    useEffect(() => {
        setEnvStatus({
            url: process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Defined' : '❌ Missing',
            key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Defined' : '❌ Missing',
            urlValueSample: process.env.NEXT_PUBLIC_SUPABASE_URL ? process.env.NEXT_PUBLIC_SUPABASE_URL.substring(0, 10) + '...' : 'N/A'
        })
    }, [])

    return (
        <div className="p-8 font-mono space-y-4">
            <h1 className="text-2xl font-bold">Environment Variable Debugger</h1>
            <div className="bg-gray-100 p-4 rounded-md border border-gray-300">
                <p><strong>NEXT_PUBLIC_SUPABASE_URL:</strong> {envStatus?.url}</p>
                <p className="text-sm text-gray-500">Value check: {envStatus?.urlValueSample}</p>
                <br />
                <p><strong>NEXT_PUBLIC_SUPABASE_ANON_KEY:</strong> {envStatus?.key}</p>
            </div>
            <p className="text-sm text-red-500">
                Note: If these say "Missing", you need to add them to Vercel Environment Variables and REDEPLOY.
            </p>
        </div>
    )
}
