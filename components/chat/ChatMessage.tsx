
import { cn } from "@/lib/utils"
import { Bot, User, FileText, Image as ImageIcon, Link as LinkIcon } from "lucide-react"

interface Attachment {
    type: "file" | "url"
    name: string
    data?: string
    url?: string
    mimeType?: string
}

interface ChatMessageProps {
    role: "user" | "assistant" | "system"
    content: string
    attachments?: Attachment[]
}

export function ChatMessage({ role, content, attachments }: ChatMessageProps) {
    return (
        <div
            className={cn(
                "flex w-full items-start gap-4 p-4 transition-all hover:bg-muted/5 rounded-xl border border-transparent hover:border-white/5",
                role === "assistant" ? "ai-message-bg animate-blur-in" : "user-message-bg animate-fade-in"
            )}
        >
            <div className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-md border shadow-sm",
                role === "user" ? "bg-background" : "bg-primary text-primary-foreground"
            )}>
                {role === "user" ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
            </div>
            <div className="flex-1 space-y-2">
                <p className="font-semibold text-sm">
                    {role === "user" ? "You" : "GovAssist AI"}
                </p>

                {/* Attachments */}
                {attachments && attachments.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                        {attachments.map((att, idx) => (
                            <div key={idx} className="flex items-center gap-2 px-3 py-1.5 bg-background border rounded-md text-xs animate-scale-in hover-lift transition-all">
                                {att.type === "file" ? (
                                    att.mimeType?.startsWith("image/") ? (
                                        <>
                                            <ImageIcon className="h-3 w-3 text-blue-600" />
                                            <span className="max-w-[150px] truncate">{att.name}</span>
                                        </>
                                    ) : (
                                        <>
                                            <FileText className="h-3 w-3 text-green-600" />
                                            <span className="max-w-[150px] truncate">{att.name}</span>
                                        </>
                                    )
                                ) : (
                                    <>
                                        <LinkIcon className="h-3 w-3 text-purple-600" />
                                        <a
                                            href={att.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="max-w-[150px] truncate hover:underline text-blue-600 transition-all"
                                        >
                                            {att.name}
                                        </a>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                <div className="prose break-words text-sm leading-relaxed text-muted-foreground">
                    {content.split('\n').map((line, i) => (
                        <p key={i} className="mb-1 last:mb-0">{line}</p>
                    ))}
                </div>
            </div>
        </div>
    )
}
