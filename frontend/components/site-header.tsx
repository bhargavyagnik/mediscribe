import Link from "next/link"
import { CrossIcon as MedicalCross, Menu } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="flex items-center space-x-2">
          <MedicalCross className="h-6 w-6 text-primary" />
          <span className="font-bold">MediScribe</span>
        </Link>
        <nav className="hidden md:flex items-center space-x-6 ml-6">
          <Link
            href="/features"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Features
          </Link>
          <Link href="/book" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
            Book Appointment
          </Link>
          <Link
            href="/doctors"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            For Doctors
          </Link>
        </nav>
        <div className="flex items-center ml-auto space-x-4">
          <Button variant="ghost" asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild>
            <Link href="/register">Get Started</Link>
          </Button>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden ml-2">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col space-y-4 mt-4">
              <Link
                href="/features"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                Features
              </Link>
              <Link
                href="/book"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                Book Appointment
              </Link>
              <Link
                href="/doctors"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                For Doctors
              </Link>
              <Link
                href="/login"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                Get Started
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}

