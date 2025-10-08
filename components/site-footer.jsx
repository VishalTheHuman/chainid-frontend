export function SiteFooter() {
  return (
    <footer className="bg-background/95 backdrop-blur text-center w-full supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
              Built with ❤️ by Team B16
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
