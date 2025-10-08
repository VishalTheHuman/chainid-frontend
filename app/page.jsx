import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button.jsx"
import { SiteHeader } from "@/components/site-header.jsx"

export default function HomePage() {
  return (
    <main className="min-h-dvh">
      <SiteHeader />
      <section className="relative overflow-hidden">
        <div className="hero-gradient absolute inset-0 animate-slow-pulse" aria-hidden="true" />
        <div className="relative mx-auto max-w-6xl px-4 py-20 md:py-28">
          <div className="grid md:grid-cols-12 gap-10 items-center">
            <div className="md:col-span-7 space-y-7">
              <div className="inline-flex items-center gap-3">
                <Image
                  src="/images/chainid-logo.png"
                  alt="ChainID"
                  width={44}
                  height={44}
                  className="rounded-xl glow"
                />
                <span className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                  Next-Gen. Authentication. Secure.
                </span>
              </div>
              <h1 className="font-display text-pretty text-4xl md:text-6xl leading-[100%] font-bold">
                Revolutionize authentication with advanced biometric technology
              </h1>
              <p className="text-balance text-muted-foreground md:text-lg">
                Experience the future of digital identity. Our cutting-edge biometric system combines facial recognition and fingerprint scanning with blockchain technology for unprecedented security and convenience.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/signup">
                  <Button className="btn-shimmer glow text-primary-foreground">Start Your Journey</Button>
                </Link>
                <Link href="/signin">
                  <Button variant="secondary" className="border-primary/20 glow">
                    Access Your Account
                  </Button>
                </Link>
              </div>
            </div>

            <div className="md:col-span-5 md:justify-self-end w-full">
              <Image
                src="/images/hero-illustration.png"
                alt="Secure biometrics illustration"
                width={640}
                height={640}
                className="hidden md:block w-full h-auto md:max-w-[520px]"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <h2 className="font-display text-2xl md:text-3xl mb-6">Why Choose ChainID?</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-subtle glass p-5">
            <h3 className="text-lg font-medium mb-1">🔒 Military-Grade Security</h3>
            <p className="text-sm text-muted-foreground">
              Advanced biometric algorithms ensure your identity is protected with enterprise-level encryption and blockchain verification.
            </p>
          </div>
          <div className="rounded-xl border border-subtle glass p-5">
            <h3 className="text-lg font-medium mb-1">📱 Universal Compatibility</h3>
            <p className="text-sm text-muted-foreground">
              Works seamlessly across all devices - desktop webcams for face recognition, mobile cameras for both face and fingerprint scanning.
            </p>
          </div>
          <div className="rounded-xl border border-subtle glass p-5">
            <h3 className="text-lg font-medium mb-1">⛓️ Blockchain Integrity</h3>
            <p className="text-sm text-muted-foreground">
              Every authentication event is permanently recorded on the blockchain, providing complete audit trails and tamper-proof verification.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="rounded-2xl border border-subtle glass p-6 md:p-8">
          <h2 className="font-display text-2xl md:text-3xl mb-3">The Future of Digital Identity</h2>
          <p className="text-muted-foreground md:text-base">
            ChainID represents the next evolution in authentication technology. By combining cutting-edge biometric recognition with blockchain infrastructure, we've created a system that's both incredibly secure and remarkably user-friendly. Your digital identity is protected by the same technology that secures cryptocurrency transactions worldwide.
          </p>
          <ul className="mt-4 grid md:grid-cols-2 gap-3 text-sm">
            <li>• 🛡️ Zero-knowledge architecture ensures your biometric data never leaves your device.</li>
            <li>• 🎯 Intelligent camera guidance adapts to your device for optimal capture quality.</li>
            <li>• 🌐 Browser-native technology - no downloads or plugins required.</li>
            <li>• ⚡ Lightning-fast verification with enterprise-grade reliability.</li>
          </ul>
          <div className="mt-6 flex gap-3">
            <Link href="/signup">
              <Button className="btn-shimmer">Join the Revolution</Button>
            </Link>
            <Link href="/signin">
              <Button variant="secondary">Sign in</Button>
            </Link>
          </div>
        </div>
      </section>

    </main>
  )
}
