import Link from "next/link";
import { ArrowRight, BarChart3, ShieldCheck, Sparkles, Wallet, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary selection:text-primary-foreground">
      
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto h-16 px-6 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
              <Wallet className="h-4 w-4" />
            </div>
            <span>FinTrack</span>
          </div>
          
          <div className="flex items-center gap-4">
            <Link 
              href="/login" 
              className="text-sm font-medium hover:text-primary transition-colors px-3 py-2 rounded-md text-nowrap"
            >
              Sign in
            </Link>
            <Link 
              href="/signup" 
              className="text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg shadow-sm transition-all text-nowrap"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 bg-muted px-3 py-1 rounded-full text-xs font-medium text-muted-foreground animate-fade-in">
            <Sparkles className="h-3 w-3 text-primary" />
            <span>Smart Personal Finance Tracker Platform</span>
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-[1.15]">
            Take Control of Your Money with <span className="bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">Real-Time</span> Analytics
          </h1>
          
          <p className="text-muted-foreground text-lg sm:text-xl max-w-2xl mx-auto font-normal leading-relaxed">
            Track expenses effortlessly, establish flexible budgets, monitor systemic records, and visualize targets without compromising security.
          </p>

          <div className="flex flex-wrap justify-center items-center gap-4 pt-4">
            <Link
              href="/signup"
              className="bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-6 rounded-xl font-medium shadow-md transition-all flex items-center gap-2 group"
            >
              Start For Free
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="#features"
              className="bg-muted hover:bg-muted/80 text-muted-foreground h-12 px-6 rounded-xl font-medium transition-colors flex items-center"
            >
              Explore Features
            </Link>
          </div>

          {/* Abstract Hero Mockup Dashboard Layout Panel */}
          <div className="pt-16 max-w-5xl mx-auto">
            <div className="rounded-2xl border bg-card text-card-foreground shadow-2xl p-4 sm:p-6 md:p-8 border-primary/10 relative group bg-gradient-to-b from-card to-background">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-transparent opacity-50 rounded-2xl pointer-events-none" />
              <div className="flex justify-between items-center border-b pb-4 mb-6">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-destructive/40" />
                  <span className="w-3 h-3 rounded-full bg-amber-400/40" />
                  <span className="w-3 h-3 rounded-full bg-emerald-400/40" />
                </div>
                <span className="text-xs text-muted-foreground font-mono bg-muted px-3 py-1 rounded-md">dashboard.fintrack.app</span>
              </div>
              <div className="grid gap-4 md:grid-cols-3 text-left">
                <div className="border rounded-xl p-4 bg-background/50">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Total Revenue</p>
                  <p className="text-2xl font-bold pt-1 text-emerald-600">+₹84,250</p>
                </div>
                <div className="border rounded-xl p-4 bg-background/50">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Expenses Spent</p>
                  <p className="text-2xl font-bold pt-1 text-destructive">-₹24,180</p>
                </div>
                <div className="border rounded-xl p-4 bg-background/50">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Active Budget Left</p>
                  <p className="text-2xl font-bold pt-1 text-primary">₹60,070</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid Grid System */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-20 border-t w-full">
        <div className="text-center space-y-3 pb-12">
          <h2 className="text-3xl font-bold tracking-tight">Engineered for Clear Bookkeeping</h2>
          <p className="text-muted-foreground max-w-lg mx-auto text-sm">
            Everything you need to optimize, audit, and analyze your financial transactions in one screen.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="border rounded-2xl p-6 bg-card hover:shadow-md transition-shadow space-y-4">
            <div className="p-3 bg-primary/10 text-primary w-fit rounded-xl">
              <BarChart3 className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold">Visual Analytics</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Understand patterns dynamically via time-series graph records, pie allocation, and filter timelines.
            </p>
          </div>

          <div className="border rounded-2xl p-6 bg-card hover:shadow-md transition-shadow space-y-4">
            <div className="p-3 bg-primary/10 text-primary w-fit rounded-xl">
              <Zap className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold">Smart Limits</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Create real-time threshold allocations per system metadata category window to intercept leaks instantly.
            </p>
          </div>

          <div className="border rounded-2xl p-6 bg-card hover:shadow-md transition-shadow space-y-4">
            <div className="p-3 bg-primary/10 text-primary w-fit rounded-xl">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold">Secure Core</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Powered by production-grade Supabase database logic structures securing row-level operations permanently.
            </p>
          </div>
        </div>
      </section>

      {/* Footer Section Footer */}
      <footer className="mt-auto border-t bg-muted/30">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} FinTrack Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-foreground">Privacy Policy</Link>
            <Link href="#" className="hover:text-foreground">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}