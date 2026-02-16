
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { FileText, ArrowRight } from "lucide-react"

const FORMS = [
    {
        id: "passport-new",
        title: "New Passport Application",
        description: "Apply for a fresh passport. Requires proof of address and identity.",
    },
    {
        id: "aadhaar-update",
        title: "Aadhaar Detail Update",
        description: "Update name, address, or date of birth in your Aadhaar card.",
    },
    {
        id: "pan-new",
        title: "New PAN Card",
        description: "Application for allotment of Permanent Account Number.",
    },
    {
        id: "income-cert-state",
        title: "Income Certificate Application",
        description: "Apply for state-issued income certificate for scholarships.",
    },
]

export default function FormsPage() {
    return (
        <div className="container py-10 min-h-[calc(100vh-4rem)] cyber-grid">
            <div className="flex flex-col gap-2 mb-12 text-center md:text-left animate-blur-in">
                <h1 className="text-4xl font-extrabold tracking-tight gradient-text">Form Filling Assistant</h1>
                <p className="text-muted-foreground text-lg">Select a form and let our AI guide you through it step-by-step.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {FORMS.map((form, idx) => (
                    <Card key={form.id} className="glass-premium transition-all hover-lift animate-scale-in group" style={{ animationDelay: `${idx * 150}ms` }}>
                        <CardHeader>
                            <div className="p-3 w-fit rounded-full bg-primary/10 text-primary mb-3 group-hover:scale-110 transition-transform duration-300">
                                <FileText className="h-8 w-8 text-accent animate-pulse-slow" />
                            </div>
                            <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
                                {form.title}
                            </CardTitle>
                            <CardDescription className="text-base text-muted-foreground/90 leading-relaxed">
                                {form.description}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-1 w-20 bg-gradient-to-r from-primary/50 to-transparent rounded-full" />
                        </CardContent>
                        <CardFooter>
                            <Link href={`/chat?q=Help me fill ${form.title}`} className="w-full">
                                <Button className="w-full gap-2 h-12 text-md glow-primary hover-scale transition-all">
                                    Start Filling <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    )
}
