import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b border-black/10 dark:border-white/15">
      <nav className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-mono text-lg font-semibold tracking-tight">
          shiplog
        </Link>
        <div className="flex items-center gap-5 text-sm">
          <Link href="/projects" className="hover:underline">
            Projects
          </Link>
          <Link href="/dashboard" className="hover:underline">
            Dashboard
          </Link>
        </div>
      </nav>
    </header>
  );
}
