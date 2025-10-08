"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button.jsx"
import { getCurrentUser, clearCurrentUser } from "@/lib/api.js"

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    setUser(getCurrentUser())
  }, [])

  const handleLogout = () => {
    clearCurrentUser()
    setUser(null)
    window.location.href = '/'
  }
  return (
    <header className="w-full sticky top-0 z-40 border-b bg-background/70 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/images/chainid-logo.png" alt="ChainID Logo" width={40} height={40} className="rounded-lg" />
          <span className="font-display tracking-tight text-sm md:text-base">ChainID</span>
        </Link>

        {/* desktop nav */}
        <nav className="hidden sm:flex items-center gap-2">
          {user ? (
            <>
              <span className="text-sm text-muted-foreground">Welcome, {user}</span>
              <Link href="/dashboard" className="ml-5">
                <Button variant="secondary">Dashboard</Button>
              </Link>
              <Button onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/signin">
                <Button variant="secondary">Sign in</Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-primary text-primary-foreground hover:opacity-90">Get started</Button>
              </Link>
            </>
          )}
        </nav>

        {/* mobile toggle */}
        <button
          aria-label="Open menu"
          aria-expanded={open}
          className="sm:hidden inline-flex items-center justify-center rounded-md bg-primary/10 hover:bg-primary/20 px-3 py-2 transition-colors"
          onClick={() => setOpen((v) => !v)}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            {open ? (
              <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {/* mobile menu overlay */}
      {open && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 sm:hidden mt-20"
            onClick={() => setOpen(false)}
          />
          {/* Menu panel */}
          <div className="fixed top-[73px] left-0 right-0 bg-background/95 backdrop-blur-md border-b border-border/20 shadow-lg z-50 sm:hidden">
            <div className="px-4 py-6">
              <div className="flex flex-col gap-3">
                {user ? (
                  <>
                    <div className="px-4 py-3 text-sm border border-border/20 rounded-lg bg-muted/30 text-foreground">
                      Welcome, <span className="font-semibold text-foreground">{user}</span>
                    </div>
                    <Link 
                      href="/dashboard" 
                      onClick={() => setOpen(false)} 
                      className="flex items-center gap-3 rounded-lg px-4 py-4 bg-primary/10 hover:bg-primary/20 text-foreground font-medium transition-colors border border-primary/20"
                    >
                      <span>Dashboard</span>
                    </Link>
                    <button
                      onClick={() => { handleLogout(); setOpen(false); }}
                      className="flex items-center gap-3 rounded-lg px-4 py-4 bg-red-500/10 hover:bg-red-500/20 text-red-600 font-medium transition-colors text-left border border-red-500/20"
                    >
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link 
                      href="/signin" 
                      onClick={() => setOpen(false)} 
                      className="flex items-center gap-3 rounded-lg px-4 py-4 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-medium transition-colors border border-border"
                    >
                      <span>Sign in</span>
                    </Link>
                    <Link
                      href="/signup"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 rounded-lg px-4 py-4 bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors border border-primary"
                    >
                      <span>Get started</span>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  )
}
