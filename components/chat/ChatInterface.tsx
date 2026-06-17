"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChatMessage } from "@/components/chat/ChatMessage"
import { Send, Sparkles, Settings2, AlertCircle, Mic, Globe, Paperclip, Link as LinkIcon, X, FileText, Image as ImageIcon, ExternalLink } from "lucide-react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { useState, useRef, useEffect } from "react"

interface Attachment {
    type: "file" | "url"
    name: string
    data?: string // base64 for files
    url?: string
    mimeType?: string
}

interface Message {
    id: string
    role: "user" | "assistant" | "system"
    content: string
    attachments?: Attachment[]
}

const INITIAL_MESSAGES: Message[] = [
    {
        id: "1",
        role: "assistant",
        content: "Hello! I am GovAssist. I can help you find schemes, explain procedures, and guide you through forms.\n\nHow can I help you today?",
    },
]

// Simulation of a Form Workflow
const FORM_WORKFLOW = {
    "income_certificate": [
        "To apply for an Income Certificate, I need a few details. First, what is your **Full Name** as per Aadhaar?",
        "Great. What is your **Annual Family Income** (in Rupees)?",
        "Which **State** do you reside in?",
        "Do you have a valid **Ration Card**? (Yes/No)",
        "Thank you! I have generated a filled application draft. Please visit your district portal to submit these details: [e-District Portal](https://edistrict.delhigovt.nic.in/)"
    ],
    "caste_certificate": [
        "For Caste Certificate, please tell me your **Name**.",
        "What is your **Father's Name**?",
        "Which **Category** do you belong to? (SC/ST/OBC)",
        "Do you have a **Caste Certificate of a blood relative**? (Yes/No)",
        "Noted. You can proceed with these details on the: [State e-District Portal](https://edistrict.delhigovt.nic.in/)"
    ],
    "driving_license": [
        "To apply for a Driving License, I need your details. What is your **Date of Birth**? (DD/MM/YYYY)",
        "Do you have a valid **Learner's License** number? (Yes/No)",
        "Which **RTO Office** is nearest to you?",
        "Great. You can book your slot for the driving test here: [Parivahan Sarathi](https://sarathi.parivahan.gov.in/)"
    ],
    "voter_id": [
        "For Voter ID Registration, let's start. Are you **18 years or older** as of today?",
        "What is your **Assembly Constituency**?",
        "Do you have a valid **Aadhaar Number** linked to your mobile?",
        "Perfect. You can complete Form-6 on the official portal: [Voters Service Portal](https://voters.eci.gov.in/)"
    ],
    "pan_card": [
        "For a new PAN Card, I need your **Full Name**.",
        "Do you want a **Physical Card** or just an e-PAN? (Physical/e-PAN)",
        "Is your **Aadhaar Linked** with your Mobile Number for OTP? (Yes/No)",
        "Understood. You can apply instantly via NSDL here: [NSDL PAN Portal](https://www.onlineservices.nsdl.com/paam/endUserRegisterContact.html)"
    ]
};

export function ChatInterface() {
    const searchParams = useSearchParams()
    const initialQuery = searchParams.get("q")

    const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES)
    const [inputValue, setInputValue] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [provider, setProvider] = useState<"openai" | "grok">("openai")
    const [error, setError] = useState<string | null>(null)
    const [language, setLanguage] = useState<"en" | "hi">("en")
    const [attachments, setAttachments] = useState<Attachment[]>([])
    const [urlInput, setUrlInput] = useState("")
    const [showUrlInput, setShowUrlInput] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Form Mode State
    const [formMode, setFormMode] = useState<{ active: boolean, type: string | null, step: number }>({ active: false, type: null, step: 0 });

    const messagesEndRef = useRef<HTMLDivElement>(null)
    const hasSentInitialRef = useRef(false)
    const activeFormRef = useRef(formMode);

    useEffect(() => { activeFormRef.current = formMode }, [formMode]);

    // Voice Input State & Handler
    const [isListening, setIsListening] = useState(false)

    const handleVoiceInput = () => {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            alert("Voice input is not supported in this browser.")
            return
        }

        // @ts-ignore
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
        const recognition = new SpeechRecognition()

        recognition.lang = language === 'hi' ? 'hi-IN' : 'en-US'
        recognition.interimResults = false
        recognition.maxAlternatives = 1

        if (isListening) {
            recognition.stop()
            setIsListening(false)
            return
        }

        setIsListening(true)
        recognition.start()

        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript
            setInputValue(prev => prev + (prev ? " " : "") + transcript)
            setIsListening(false)
        }

        recognition.onerror = (event: any) => {
            if (event.error === 'no-speech') {
                // Just stop listening without error
                setIsListening(false)
                return
            }
            if (event.error === 'not-allowed') {
                setError("Microphone access denied. Please enable permissions.")
                setIsListening(false)
                return
            }

            console.error("Speech recognition error", event.error)
            setError(`Voice Error: ${event.error}`)
            setIsListening(false)
        }

        recognition.onend = () => {
            setIsListening(false)
        }
    }

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    // File handling functions
    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files || files.length === 0) return

        const filePromises = Array.from(files).map(file => {
            return new Promise<Attachment>((resolve) => {
                const reader = new FileReader()
                reader.onload = (event) => {
                    const base64 = event.target?.result as string
                    resolve({
                        type: "file",
                        name: file.name,
                        data: base64,
                        mimeType: file.type
                    })
                }
                reader.readAsDataURL(file)
            })
        })

        const newAttachments = await Promise.all(filePromises)
        setAttachments(prev => [...prev, ...newAttachments])

        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    const handleAddUrl = () => {
        if (!urlInput.trim()) return

        setAttachments(prev => [...prev, {
            type: "url",
            name: urlInput,
            url: urlInput
        }])
        setUrlInput("")
        setShowUrlInput(false)
    }

    const removeAttachment = (index: number) => {
        setAttachments(prev => prev.filter((_, i) => i !== index))
    }

    const handleSendMessage = async (e?: React.FormEvent, overrideContent?: string) => {
        e?.preventDefault()

        const content = overrideContent || inputValue
        // Allow sending if there's text OR attachments
        if (!content.trim() && attachments.length === 0) return

        const userMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content: content,
            attachments: attachments.length > 0 ? attachments : undefined
        }

        setMessages((prev) => [...prev, userMessage])
        setInputValue("")
        setAttachments([])
        setIsLoading(true)
        setError(null)

        // --- FORM MODE LOGIC ---
        // 1. Check if entering form mode
        if (!activeFormRef.current.active && (content.toLowerCase().includes("fill form") || content.toLowerCase().includes("apply for"))) {
            let formType = null;
            if (content.toLowerCase().includes("income")) formType = "income_certificate";
            else if (content.toLowerCase().includes("caste")) formType = "caste_certificate";
            else if (content.toLowerCase().includes("driving") || content.toLowerCase().includes("license")) formType = "driving_license";
            else if (content.toLowerCase().includes("voter")) formType = "voter_id";
            else if (content.toLowerCase().includes("pan")) formType = "pan_card";

            if (formType) {
                const fType = formType as keyof typeof FORM_WORKFLOW;
                setFormMode({ active: true, type: fType, step: 0 });
                setTimeout(() => {
                    const aiMsg: Message = { id: Date.now().toString(), role: "assistant", content: FORM_WORKFLOW[fType][0] };
                    setMessages(p => [...p, aiMsg]);
                    setIsLoading(false);
                }, 1000);
                return;
            }
        }

        // 2. Handle steps if active
        // Use ref for current state to avoid closure staleness in timeouts
        if (activeFormRef.current.active && activeFormRef.current.type) {
            const fType = activeFormRef.current.type as keyof typeof FORM_WORKFLOW;
            const currentWorkflow = FORM_WORKFLOW[fType];
            const nextStep = activeFormRef.current.step + 1;

            if (nextStep < currentWorkflow.length) {
                setTimeout(() => {
                    const aiMsg: Message = { id: Date.now().toString(), role: "assistant", content: currentWorkflow[nextStep] };
                    setMessages(p => [...p, aiMsg]);
                    setFormMode(p => ({ ...p, step: nextStep }));

                    if (nextStep === currentWorkflow.length - 1) {
                        setFormMode(p => ({ ...p, active: false, type: null, step: 0 }));
                    }
                    setIsLoading(false);
                }, 1000);
                return; // Return early, do not call API
            }
        }
        // --- END FORM MODE LOGIC ---

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: messages.concat(userMessage).map(m => ({
                        role: m.role,
                        content: m.content,
                        attachments: m.attachments
                    })),
                    provider,
                    language // Pass language
                }),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || "Failed to get response")
            }

            const data = await response.json()

            if (data.isMock && data.debugError === 'insufficient_quota') {
                // setError("Note: OpenAI Quota Exceeded. Using Basic Mode.")
                // Silent fallback requested by user "just connect it"
            } else if (data.isMock) {
                // setError("Note: Using Basic Mode (AI unavailable).")
            }

            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: data.content,
            }

            setMessages((prev) => [...prev, aiMessage])
        } catch (err: any) {
            console.error(err)
            // Silently fail to mock if API fails implies network error
            setMessages((prev) => [...prev, {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: `(Offline Mode) I can't connect to the server right now, but I can tell you that for **${content}**, you should check the official portal.`
            }])
        } finally {
            setIsLoading(false)
        }
    }

    // Auto-send initial query if present
    useEffect(() => {
        if (initialQuery && !hasSentInitialRef.current) {
            hasSentInitialRef.current = true
            // Delay slightly to allow UI to mount
            setTimeout(() => {
                handleSendMessage(undefined, initialQuery)
            }, 500)
        }
    }, [initialQuery])

    return (
        <div className="flex flex-col h-[calc(100dvh-3.5rem)] md:h-[calc(100dvh-3.5rem)] max-w-4xl mx-auto md:border md:rounded-xl overflow-hidden md:shadow-2xl md:my-4 md:neon-border md:glass-premium animate-scale-in">
            {/* Header / Settings Bar */}
            <div className="flex items-center justify-between px-3 py-2 border-b bg-background/40 backdrop-blur-md">
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setLanguage(l => l === 'en' ? 'hi' : 'en')}
                        className={`text-xs px-2 h-8 ${language === 'hi' ? "bg-orange-100 text-orange-700 hover:bg-orange-200" : "hover:bg-muted"} transition-colors`}
                    >
                        <Globe className="h-3.5 w-3.5 mr-1" />
                        <span className="hidden sm:inline">{language === 'en' ? "English" : "हिंदी"}</span>
                        <span className="sm:hidden">{language === 'en' ? "EN" : "HI"}</span>
                    </Button>
                </div>

                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open("https://chatgpt.com", "_blank")}
                        title="Open ChatGPT"
                        className="hover:bg-muted h-8 w-8 px-0"
                    >
                        <ExternalLink className="h-3.5 w-3.5" />
                    </Button>
                    <Select value={provider} onValueChange={(val: "openai" | "grok") => setProvider(val)}>
                        <SelectTrigger className="w-[110px] sm:w-[140px] h-8 text-xs">
                            <SelectValue placeholder="AI Model" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="openai">ChatGPT</SelectItem>
                            <SelectItem value="grok">Grok (xAI)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 overscroll-contain">
                {messages.map((msg) => (
                    <ChatMessage key={msg.id} role={msg.role} content={msg.content} attachments={msg.attachments} />
                ))}
                {isLoading && (
                    <div className="ml-8 sm:ml-12 flex items-center gap-2 text-muted-foreground animate-fade-in">
                        <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                        </div>
                        <span className="text-sm font-medium gradient-text">GovAssist is thinking...</span>
                    </div>
                )}
                {error && (
                    <div className="mx-auto flex items-center gap-2 p-3 text-sm text-destructive bg-destructive/10 rounded-md max-w-sm animate-scale-in">
                        <AlertCircle className="h-4 w-4 flex-shrink-0" />
                        <span>{error}</span>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-2 sm:p-4 border-t bg-background safe-area-bottom">
                {/* Attachments Preview */}
                {attachments.length > 0 && (
                    <div className="mb-2 flex flex-wrap gap-1.5 animate-fade-in">
                        {attachments.map((att, idx) => (
                            <div key={idx} className="flex items-center gap-1.5 px-2 py-1 bg-muted rounded-md text-xs border">
                                {att.type === "file" ? (
                                    att.mimeType?.startsWith("image/") ? (
                                        <ImageIcon className="h-3 w-3 text-blue-600" />
                                    ) : (
                                        <FileText className="h-3 w-3 text-green-600" />
                                    )
                                ) : (
                                    <LinkIcon className="h-3 w-3 text-purple-600" />
                                )}
                                <span className="max-w-[120px] sm:max-w-[200px] truncate">{att.name}</span>
                                <button
                                    type="button"
                                    onClick={() => removeAttachment(idx)}
                                    className="ml-0.5 hover:bg-destructive/20 rounded-sm p-0.5 transition-colors"
                                >
                                    <X className="h-3 w-3 text-destructive" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* URL Input */}
                {showUrlInput && (
                    <div className="mb-2 flex gap-1.5 animate-slide-in-left">
                        <Input
                            placeholder="Enter URL (e.g., https://example.com)"
                            value={urlInput}
                            onChange={(e) => setUrlInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") { e.preventDefault(); handleAddUrl() }
                            }}
                            className="flex-1 h-8 text-sm"
                            autoFocus
                        />
                        <Button type="button" onClick={handleAddUrl} size="sm" className="h-8 px-3">Add</Button>
                        <Button type="button" onClick={() => { setShowUrlInput(false); setUrlInput("") }} size="sm" variant="outline" className="h-8 px-3">✕</Button>
                    </div>
                )}

                <form onSubmit={(e) => handleSendMessage(e)} className="flex items-center gap-1.5">
                    {/* Hidden file input */}
                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*,audio/*,application/pdf,.doc,.docx,.txt"
                        onChange={handleFileSelect}
                        className="hidden"
                    />

                    {/* Attach File */}
                    <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        title="Attach File"
                        onClick={() => fileInputRef.current?.click()}
                        className="h-9 w-9 flex-shrink-0 hover:bg-muted transition-colors"
                    >
                        <Paperclip className="h-4 w-4 text-muted-foreground" />
                    </Button>

                    {/* URL Button - hidden on xs, shown sm+ */}
                    <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        title="Add URL"
                        onClick={() => setShowUrlInput(!showUrlInput)}
                        className="hidden sm:flex h-9 w-9 flex-shrink-0 hover:bg-muted transition-colors"
                    >
                        <LinkIcon className="h-4 w-4 text-muted-foreground" />
                    </Button>

                    {/* Voice Input */}
                    <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        title={isListening ? "Stop Listening" : "Voice Input"}
                        onClick={handleVoiceInput}
                        className={`h-9 w-9 flex-shrink-0 transition-colors ${isListening ? "bg-red-500/20 text-red-500 border-red-500/50 animate-pulse" : "hover:bg-muted"}`}
                    >
                        <Mic className={`h-4 w-4 ${isListening ? "" : "text-muted-foreground"}`} />
                    </Button>

                    <Input
                        placeholder="Ask about government services..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        disabled={isLoading}
                        className="flex-1 h-9 text-sm bg-muted/30 focus:ring-1 focus:ring-primary"
                    />

                    <Button
                        type="submit"
                        disabled={isLoading || (!inputValue.trim() && attachments.length === 0)}
                        className="h-9 w-9 flex-shrink-0 p-0 glow-primary"
                    >
                        {isLoading ? <span className="text-xs">...</span> : <Send className="h-4 w-4" />}
                        <span className="sr-only">Send</span>
                    </Button>
                </form>
            </div>
        </div>
    )
}
