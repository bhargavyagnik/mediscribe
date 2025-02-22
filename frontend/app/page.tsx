import Link from "next/link"
import { ArrowRight, CheckCircle2, Clock, FileText, MessageSquare, Stethoscope } from "lucide-react"

import { Button } from "@/components/ui/button"
import { SiteHeader } from "@/components/site-header"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Smart Healthcare Communication Platform
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Streamline patient care with AI-powered documentation, seamless appointment booking, and efficient
                  communication tools.
                </p>
              </div>
              <div className="space-x-4">
                <Button asChild size="lg">
                  <Link href="/book">
                    Book Appointment
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/doctors">For Doctors</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Easy Scheduling</h3>
                <p className="text-muted-foreground">
                  Book appointments quickly and efficiently with our intuitive scheduling system.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="bg-primary/10 p-3 rounded-full">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">AI-Powered Documentation</h3>
                <p className="text-muted-foreground">
                  Automatically generate clinical notes and summaries from recorded conversations.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="bg-primary/10 p-3 rounded-full">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Smart Handouts</h3>
                <p className="text-muted-foreground">
                  Generate personalized patient handouts and referral letters with AI assistance.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 lg:grid-cols-2">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">For Healthcare Providers</h2>
                <p className="text-gray-500 dark:text-gray-400">
                  Streamline your practice with our comprehensive suite of tools designed specifically for healthcare
                  providers.
                </p>
                <ul className="grid gap-4">
                  <li className="flex items-center gap-4">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <span>AI-powered conversation recording and summarization</span>
                  </li>
                  <li className="flex items-center gap-4">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <span>Efficient patient management system</span>
                  </li>
                  <li className="flex items-center gap-4">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <span>Automated clinical documentation</span>
                  </li>
                </ul>
                <Button asChild>
                  <Link href="/doctors">Learn More</Link>
                </Button>
              </div>
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">For Patients</h2>
                <p className="text-gray-500 dark:text-gray-400">
                  Take control of your healthcare journey with easy appointment booking and clear communication.
                </p>
                <ul className="grid gap-4">
                  <li className="flex items-center gap-4">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <span>Simple online appointment booking</span>
                  </li>
                  <li className="flex items-center gap-4">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <span>Clear treatment instructions and follow-ups</span>
                  </li>
                  <li className="flex items-center gap-4">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <span>Easy access to medical documentation</span>
                  </li>
                </ul>
                <Button asChild>
                  <Link href="/book">Book Now</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t">
        <div className="container flex flex-col gap-4 py-10 md:flex-row md:py-12">
          <div className="flex items-center space-x-2">
            <Stethoscope className="h-6 w-6 text-primary" />
            <span className="font-bold">MediScribe</span>
          </div>
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built with care for healthcare professionals and patients.
          </p>
          <nav className="md:ml-auto">
            <ul className="flex space-x-4 text-sm">
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-foreground">
                  Terms
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="mailto:contact@bhargavyagnik.com" className="text-muted-foreground hover:text-foreground">
                  Contact
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </footer>
    </div>
  )
}

