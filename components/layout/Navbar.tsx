"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Bot, FileText, Home, Search, Menu, X } from "lucide-react"

export function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false)

    return (
        <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
            <div className="container flex h-14 items-center justify-between px-4">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 font-bold text-xl text-gradient-brand" onClick={() => setMobileOpen(false)}>
                    <Bot className="h-6 w-6 text-primary" />
                    <span>GovAssist</span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-6 text-sm font-medium">
                    <Link href="/" className="transition-colors hover:text-primary flex items-center gap-1.5">
                        <Home className="h-4 w-4" /> Home
                    </Link>
                    <Link href="/chat" className="transition-colors hover:text-primary flex items-center gap-1.5">
                        <Bot className="h-4 w-4" /> Assistant
                    </Link>
                    <Link href="/schemes" className="transition-colors hover:text-primary flex items-center gap-1.5">
                        <Search className="h-4 w-4" /> Schemes
                    </Link>
                    <Link href="/forms" className="transition-colors hover:text-primary flex items-center gap-1.5">
                        <FileText className="h-4 w-4" /> Forms
                    </Link>
                </div>

                {/* Desktop CTA */}
                <div className="hidden md:flex items-center gap-2">
                    <Link href="/login">
                        <Button variant="ghost" size="sm">Log in</Button>
                    </Link>
                    <Link href="/chat">
                        <Button size="sm">Get Started</Button>
                    </Link>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden p-2 rounded-md hover:bg-muted transition-colors"
                    onClick={() => setMobileOpen(!mobileOpen)}
                    aria-label="Toggle menu"
                >
                    {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
            </div>

            {/* Mobile Dropdown */}
            {mobileOpen && (
                <div className="md:hidden border-t bg-background/98 backdrop-blur px-4 py-4 flex flex-col gap-3 animate-fade-in">
                    <Link href="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 py-2 text-sm font-medium hover:text-primary transition-colors">
                        <Home className="h-4 w-4" /> Home
                    </Link>
                    <Link href="/chat" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 py-2 text-sm font-medium hover:text-primary transition-colors">
                        <Bot className="h-4 w-4" /> AI Assistant
                    </Link>
                    <Link href="/schemes" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 py-2 text-sm font-medium hover:text-primary transition-colors">
                        <Search className="h-4 w-4" /> Browse Schemes
                    </Link>
                    <Link href="/forms" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 py-2 text-sm font-medium hover:text-primary transition-colors">
                        <FileText className="h-4 w-4" /> Smart Forms
                    </Link>
                    <div className="flex gap-2 pt-2 border-t">
                        <Link href="/login" className="flex-1" onClick={() => setMobileOpen(false)}>
                            <Button variant="outline" size="sm" className="w-full">Log in</Button>
                        </Link>
                        <Link href="/chat" className="flex-1" onClick={() => setMobileOpen(false)}>
                            <Button size="sm" className="w-full">Get Started</Button>
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    )
}
