
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Bot, FileText, Home, Search } from "lucide-react"

export function Navbar() {
    return (
        <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
            <div className="container flex h-16 items-center justify-between px-4">
                <Link href="/" className="flex items-center gap-2 font-bold text-xl text-gradient-brand">
                    <Bot className="h-6 w-6 text-primary" />
                    <span>GovAssist</span>
                </Link>
                <div className="hidden md:flex items-center gap-6 text-sm font-medium">
                    <Link href="/" className="transition-colors hover:text-primary flex items-center gap-2">
                        <Home className="h-4 w-4" />
                        Home
                    </Link>
                    <Link href="/chat" className="transition-colors hover:text-primary flex items-center gap-2">
                        <Bot className="h-4 w-4" />
                        Assistant
                    </Link>
                    <Link href="/schemes" className="transition-colors hover:text-primary flex items-center gap-2">
                        <Search className="h-4 w-4" />
                        Schemes
                    </Link>
                    <Link href="/forms" className="transition-colors hover:text-primary flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Forms
                    </Link>
                </div>
                <div className="flex items-center gap-2">
                    <Link href="/login">
                        <Button variant="ghost" size="sm">
                            Log in
                        </Button>
                    </Link>
                    <Link href="/chat">
                        <Button size="sm">Get Started</Button>
                    </Link>
                </div>
            </div>
        </nav>
    )
}
