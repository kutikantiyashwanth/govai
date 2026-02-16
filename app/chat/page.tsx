
import { Suspense } from "react"
import { ChatInterface } from "@/components/chat/ChatInterface"
import { Sparkles } from "lucide-react"

export default function ChatPage() {
    return (
        <div className="container py-6 md:py-10 h-full">
            <div className="flex flex-col gap-4 mb-4">
                <h1 className="text-2xl font-bold tracking-tight">GovAssist AI</h1>
                <p className="text-muted-foreground">
                    Your personal expert for all government procedures.
                </p>
            </div>
            <Suspense fallback={
                <div className="flex h-[400px] items-center justify-center gap-2 text-muted-foreground">
                    <Sparkles className="h-4 w-4 animate-spin" /> Loading Asssitant...
                </div>
            }>
                <ChatInterface />
            </Suspense>
        </div>
    )
}
