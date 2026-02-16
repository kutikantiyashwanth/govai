
"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { CheckCircle2, XCircle, Loader2, User, Database, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"

export function SupabaseDebug() {
    const [status, setStatus] = useState<"loading" | "connected" | "error">("loading")
    const [msg, setMsg] = useState("")
    const [user, setUser] = useState<any>(null)
    const [showDetails, setShowDetails] = useState(false)
    const [dbUrl, setDbUrl] = useState("")

    useEffect(() => {
        const checkConnection = async () => {
            try {
                const supabase = createClient()

                // Get Supabase URL
                const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "Not configured"
                setDbUrl(url)

                // Check session
                const { data: { session }, error: sessionError } = await supabase.auth.getSession()
                if (sessionError) throw sessionError

                // Get user
                const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser()
                if (userError && userError.message !== "Auth session missing!") {
                    throw userError
                }

                setUser(currentUser)
                setStatus("connected")
                setMsg(currentUser ? `Logged in as ${currentUser.email}` : "Connected (Not logged in)")
            } catch (err: any) {
                setStatus("error")
                setMsg(err.message || "Failed to connect")
            }
        }

        checkConnection()
    }, [])

    if (status === "loading") {
        return (
            <div className="text-xs text-muted-foreground flex items-center gap-1 animate-pulse">
                <Loader2 className="h-3 w-3 animate-spin" />
                Checking connection...
            </div>
        )
    }

    if (status === "connected") {
        return (
            <div className="w-full">
                <div className="text-xs flex items-center gap-2 border border-green-500/30 bg-green-500/10 px-3 py-2 rounded-md">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <div className="flex-1">
                        <div className="font-semibold text-green-400">Supabase Connected</div>
                        {user ? (
                            <div className="text-green-300 flex items-center gap-1 mt-1">
                                <User className="h-3 w-3" />
                                {user.email}
                            </div>
                        ) : (
                            <div className="text-muted-foreground">Not logged in</div>
                        )}
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowDetails(!showDetails)}
                        className="h-6 w-6 p-0"
                    >
                        {showDetails ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                    </Button>
                </div>

                {showDetails && (
                    <div className="mt-2 text-xs border border-muted bg-muted/30 px-3 py-2 rounded-md space-y-1 animate-scale-in">
                        <div className="flex items-center gap-2">
                            <Database className="h-3 w-3 text-primary" />
                            <span className="font-mono text-[10px] truncate">{dbUrl}</span>
                        </div>
                        {user && (
                            <>
                                <div className="text-muted-foreground">
                                    <span className="font-semibold">User ID:</span> {user.id?.slice(0, 8)}...
                                </div>
                                <div className="text-muted-foreground">
                                    <span className="font-semibold">Created:</span> {new Date(user.created_at).toLocaleDateString()}
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
        )
    }

    return (
        <div className="text-xs flex items-center gap-2 border border-destructive/30 bg-destructive/10 px-3 py-2 rounded-md animate-scale-in">
            <XCircle className="h-4 w-4 text-destructive animate-bounce" />
            <div className="flex-1">
                <div className="font-semibold text-destructive">Connection Error</div>
                <div className="text-destructive/80 text-[10px] mt-1">{msg}</div>
            </div>
        </div>
    )
}
