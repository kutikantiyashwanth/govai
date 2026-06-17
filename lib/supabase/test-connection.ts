import { createClient } from '@/lib/supabase/client'

export async function testSupabaseConnection() {
    const supabase = createClient()

    try {
        // Test 1: Check if Supabase client is initialized
        console.log('✅ Supabase client created')

        // Test 2: Try to get session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        if (sessionError) {
            console.error('❌ Session error:', sessionError.message)
            return { success: false, error: sessionError.message }
        }
        console.log('✅ Session check passed', session ? 'User logged in' : 'No active session')

        // Test 3: Try to get user
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        if (userError) {
            console.error('❌ User error:', userError.message)
            return { success: false, error: userError.message }
        }
        console.log('✅ User check passed', user ? `User: ${user.email}` : 'No user')

        return {
            success: true,
            session: !!session,
            user: user?.email || null,
            message: 'Supabase connection successful!'
        }
    } catch (error: any) {
        console.error('❌ Connection test failed:', error.message)
        return { success: false, error: error.message }
    }
}
