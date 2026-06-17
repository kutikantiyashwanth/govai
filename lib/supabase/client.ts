
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

    const isValidUrl = url.startsWith('http://') || url.startsWith('https://')

    if (!isValidUrl) {
        console.warn(
            '⚠️ Warning: NEXT_PUBLIC_SUPABASE_URL is not configured or is invalid. ' +
            'Authentication requests will fail gracefully rather than crashing.'
        )
    }

    return createBrowserClient(
        isValidUrl ? url : 'https://placeholder-invalid-url.supabase.co',
        anonKey || 'placeholder-key'
    )
}
