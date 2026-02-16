
"use client"

import { useState } from "react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Search } from "lucide-react"

const SCHEMES = [
    {
        id: "pm-kisan",
        title: "PM-KISAN Samman Nidhi",
        description: "Financial support of ₹6,000 per year to landholding farmer families.",
        category: "Agriculture",
        eligibility: "Landholding farmers"
    },
    {
        id: "ayushman-bharat",
        title: "Ayushman Bharat PMJAY",
        description: "Health insurance coverage of up to ₹5 lakh per family per year.",
        category: "Health",
        eligibility: "Low income families"
    },
    {
        id: "passport",
        title: "Passport Seva",
        description: "Official travel document issued by the Government of India.",
        category: "Identity",
        eligibility: "Indian Citizens"
    },
    {
        id: "atal-pension",
        title: "Atal Pension Yojana",
        description: "Pension scheme for unorganized sector workers.",
        category: "Finance",
        eligibility: "Age 18-40 years"
    },
    {
        id: "sukanya-samriddhi",
        title: "Sukanya Samriddhi Yojana",
        description: "Savings scheme for the girl child under 'Beti Bachao Beti Padhao'.",
        category: "Finance",
        eligibility: "Girl child < 10 years"
    }
]

export default function SchemesPage() {
    const [search, setSearch] = useState("")

    const filteredSchemes = SCHEMES.filter(scheme =>
        scheme.title.toLowerCase().includes(search.toLowerCase()) ||
        scheme.category.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="container py-10 min-h-[calc(100vh-4rem)] cyber-grid">
            <div className="flex flex-col gap-2 mb-12 text-center md:text-left animate-blur-in">
                <h1 className="text-4xl font-extrabold tracking-tight gradient-text">Government Schemes</h1>
                <p className="text-muted-foreground text-lg">Find schemes that match your profile.</p>
            </div>

            <div className="relative mb-12 max-w-lg mx-auto md:mx-0 animate-slide-in-right">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search schemes (e.g. 'health', 'pension')..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9 h-12 glass transition-all focus:ring-2 focus:ring-accent"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSchemes.map((scheme, idx) => (
                    <Card key={scheme.id} className="flex flex-col glass-premium hover-lift transition-all animate-scale-in" style={{ animationDelay: `${idx * 100}ms` }}>
                        <CardHeader>
                            <div className="flex justify-between items-start mb-2">
                                <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/20">{scheme.category}</Badge>
                            </div>
                            <CardTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
                                {scheme.title}
                            </CardTitle>
                            <CardDescription className="mt-2 text-base text-muted-foreground/90 leading-relaxed">
                                {scheme.description}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <p className="text-sm font-medium text-muted-foreground/80 bg-background/30 p-2 rounded-md border border-white/5">
                                <span className="text-accent font-semibold">Eligibility:</span> {scheme.eligibility}
                            </p>
                        </CardContent>
                        <CardFooter>
                            <Link href={`/chat?q=Check eligibility for ${scheme.title}`} className="w-full">
                                <Button className="w-full glow-primary hover-scale transition-all" variant="default">
                                    Check Eligibility
                                </Button>
                            </Link>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            {filteredSchemes.length === 0 && (
                <div className="text-center py-20 text-muted-foreground animate-pulse">
                    No schemes found matching "{search}"
                </div>
            )}
        </div>
    )
}
