
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "@/components/ui/card"
import { AlertCircle, Loader2, Mail, Lock, CheckCircle2 } from "lucide-react"
import { SupabaseDebug } from "@/components/SupabaseDebug"

// Force dynamic rendering (no static generation)
export const dynamic = 'force-dynamic'

export default function LoginPage() {
    const router = useRouter()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [isSignUp, setIsSignUp] = useState(false)
    const [successMsg, setSuccessMsg] = useState<string | null>(null)
    const [countdown, setCountdown] = useState<number | null>(null)


    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault()

        // Simple client-side validation
        if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            setError("Please enter a valid email address.")
            return
        }
        if (password.length < 6) {
            setError("Password must be at least 6 characters.")
            return
        }

        setLoading(true)
        setError(null)
        setSuccessMsg(null)

        // Create Supabase client only when needed (at runtime)
        const supabase = createClient()

        try {
            if (isSignUp) {
                // Sign up WITHOUT email verification
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: `${window.location.origin}/auth/callback`,
                        // @ts-ignore
                        data: {
                            email_confirmed: true // Auto-confirm for development
                        }
                    }
                })
                if (error) throw error

                // If session exists, we are logged in!
                if (data.session) {
                    setSuccessMsg("✅ Account created! Redirecting...")
                    router.refresh()
                    router.push("/")
                    return
                }

                // If no session, try signing in manually (just in case)
                // If the user ALREADY EXISTS, signUp returns success but no session (usually).
                // Then signInWithPassword will fail if the password doesn't match the existing one.
                const { error: signInError } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                })

                if (signInError) {
                    // If we get "Invalid login credentials" here, it means the user exists but password didn't match
                    if (signInError.message.includes("Invalid login credentials")) {
                        throw new Error("This email is already registered. Please sign in with your password.")
                    }
                    throw signInError
                }

                setSuccessMsg("✅ Account created! Redirecting...")
                setTimeout(() => {
                    router.push("/")
                    router.refresh()
                }, 1000)
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                })
                if (error) throw error
                setSuccessMsg("✅ Login successful! Redirecting...")
                setTimeout(() => {
                    router.push("/")
                    router.refresh()
                }, 1000)
            }
        } catch (err: any) {
            // Check for rate limiting error
            if (err.message?.includes('48 seconds') || err.message?.includes('security purposes')) {
                setError("⏱️ Too many attempts. Please wait 48 seconds before trying again.")
                setCountdown(48) // Start countdown
            } else if (err.message?.includes('rate limit')) {
                setError("⏱️ Rate limit reached. Please wait a moment and try again.")
                setCountdown(30) // Start countdown
            } else if (err.message?.includes('Email already registered') || err.message?.includes('already been registered')) {
                setError("📧 This email is already registered. Try signing in instead!")
            } else {
                setError(err.message || "Authentication failed. Please try again.")
            }
        } finally {
            setLoading(false)
        }
    }

    // Countdown timer effect
    useEffect(() => {
        if (countdown !== null && countdown > 0) {
            const timer = setTimeout(() => {
                setCountdown(countdown - 1)
            }, 1000)
            return () => clearTimeout(timer)
        } else if (countdown === 0) {
            setCountdown(null)
            setError(null)
        }
    }, [countdown])

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-background p-4 cyber-grid">
            <Card className="w-full max-w-md glass-premium animate-scale-in">
                <CardHeader className="text-center space-y-2">
                    <CardTitle className="text-3xl text-gradient-brand font-bold">
                        {isSignUp ? "Create Account" : "Welcome Back"}
                    </CardTitle>
                    <CardDescription className="text-base">
                        {isSignUp
                            ? "Create your account instantly - no email verification needed!"
                            : "Sign in to access your GovAssist dashboard."
                        }
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleAuth} className="space-y-4">
                        {error && (
                            <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md flex items-center gap-2 animate-scale-in border border-destructive/30">
                                <AlertCircle className="h-4 w-4 animate-bounce" />
                                <div className="flex-1">
                                    {error}
                                    {countdown !== null && countdown > 0 && (
                                        <div className="mt-1 font-mono text-xs">
                                            ⏱️ Retry in: <span className="font-bold text-lg">{countdown}s</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                        {successMsg && (
                            <div className="bg-green-500/15 text-green-400 text-sm p-3 rounded-md flex items-center gap-2 animate-scale-in border border-green-500/30">
                                <CheckCircle2 className="h-4 w-4" />
                                {successMsg}
                            </div>
                        )}
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                                <Mail className="h-4 w-4 text-primary" />
                                Email
                            </label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="transition-all focus:ring-2 focus:ring-primary"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-medium flex items-center gap-2">
                                <Lock className="h-4 w-4 text-primary" />
                                Password
                            </label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                                className="transition-all focus:ring-2 focus:ring-primary"
                            />
                        </div>
                        <Button type="submit" className="w-full glow-primary animate-glow-pulse hover-scale transition-all" disabled={loading}>
                            {loading ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    {isSignUp ? "Creating Account..." : "Signing In..."}
                                </>
                            ) : (
                                isSignUp ? "Sign Up" : "Sign In"
                            )}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col gap-4 justify-center">
                    <Button
                        variant="ghost"
                        className="underline hover-scale transition-all"
                        onClick={() => {
                            setIsSignUp(!isSignUp)
                            setError(null)
                            setSuccessMsg(null)
                        }}
                    >
                        {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
