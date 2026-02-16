
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Bot, CheckCircle2, FileText, Globe, Search, ShieldCheck } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center space-y-10 py-24 text-center md:py-32 lg:py-40 bg-gradient-to-br from-background via-accent/5 to-primary/10 animate-gradient-xy cyber-grid relative overflow-hidden">
        {/* Background Glow Effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 blur-[120px] rounded-full pointer-events-none animate-pulse-slow" />

        <div className="container px-4 md:px-6 relative z-10">
          <div className="mx-auto flex max-w-[980px] flex-col items-center gap-6 animate-blur-in">
            <div className="inline-flex items-center rounded-lg bg-secondary/50 border border-primary/20 px-3 py-1 text-sm font-medium backdrop-blur-sm">
              <span className="flex h-2 w-2 rounded-full bg-accent mr-2 animate-pulse"></span>
              GovAssist AI Beta is live
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Government Services, <br className="hidden sm:inline" />
              <span className="text-gradient-brand animate-pulse-slow">Simplified for You.</span>
            </h1>
            <p className="max-w-[700px] text-lg text-muted-foreground md:text-xl">
              Navigate schemes, fill forms, and get instant answers with your personal AI assistant. No more confusion, just results.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center mt-6">
              <Link href="/chat" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto gap-2 text-base px-8 h-12 glow-primary animate-glow-pulse hover-scale transition-all">
                  Start Assistant <Bot className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/schemes" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto gap-2 text-base px-8 h-12 hover-scale transition-all neon-border glass active:scale-95">
                  Browse Schemes <Search className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-24 px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start space-y-4 p-8 rounded-2xl glass-premium hover-lift transition-all animate-float">
            <div className="p-4 rounded-xl bg-primary/10 text-primary animate-pulse-slow shadow-inner">
              <Bot className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">AI Chat Assistant</h3>
            <p className="text-muted-foreground leading-relaxed">
              Ask questions in plain language. "How do I apply for a passport?" or "What are the benefits of PM-KISAN?"
            </p>
          </div>
          <div className="flex flex-col items-center md:items-start space-y-4 p-8 rounded-2xl glass-premium hover-lift transition-all animate-float-delayed">
            <div className="p-4 rounded-xl bg-primary/10 text-primary animate-pulse-slow shadow-inner">
              <FileText className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Smart Form Filling</h3>
            <p className="text-muted-foreground leading-relaxed">
              Stop struggling with complex forms. Our AI guides you field-by-field and validates your inputs.
            </p>
          </div>
          <div className="flex flex-col items-center md:items-start space-y-4 p-8 rounded-2xl glass-premium hover-lift transition-all animate-float">
            <div className="p-4 rounded-xl bg-primary/10 text-primary animate-pulse-slow shadow-inner">
              <Globe className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Multi-Language</h3>
            <p className="text-muted-foreground leading-relaxed">
              Access services in your preferred language. We support English, Hindi, and regional languages.
            </p>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="bg-muted/30 py-24 border-t border-primary/10">
        <div className="container px-4 md:px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tight mb-12 gradient-text">Why Citizens Trust GovAssist</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col items-center space-y-2 hover-scale transition-all">
              <ShieldCheck className="h-10 w-10 text-accent mb-2" />
              <h4 className="font-semibold">Secure & Private</h4>
              <p className="text-sm text-muted-foreground">Your data is encrypted and safe.</p>
            </div>
            <div className="flex flex-col items-center space-y-2 hover-scale transition-all">
              <CheckCircle2 className="h-10 w-10 text-accent mb-2" />
              <h4 className="font-semibold">Verified Info</h4>
              <p className="text-sm text-muted-foreground">Directly from official sources.</p>
            </div>
            <div className="flex flex-col items-center space-y-2 hover-scale transition-all">
              <Bot className="h-10 w-10 text-accent mb-2" />
              <h4 className="font-semibold">24/7 Availability</h4>
              <p className="text-sm text-muted-foreground">Get help anytime, anywhere.</p>
            </div>
            <div className="flex flex-col items-center space-y-2 hover-scale transition-all">
              <ArrowRight className="h-10 w-10 text-accent mb-2" />
              <h4 className="font-semibold">Fast Processing</h4>
              <p className="text-sm text-muted-foreground">Reduce delays in applications.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
