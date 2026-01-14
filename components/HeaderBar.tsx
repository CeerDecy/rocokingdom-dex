import Link from "next/link";

export default function HeaderBar() {
  return (
    <nav className="fixed top-0 z-50 w-full border-b border-black/5 bg-white/70 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-semibold tracking-tight text-black"
          >
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-black">
              <div className="h-2 w-2 rounded-full bg-[#f8e16c]" />
            </div>
            Rocokindom Dex
          </Link>
          <div className="flex items-center gap-6 text-sm text-black/70">
            <Link href="/dex" className="transition-colors hover:text-black">
              图鉴
            </Link>
            <Link
              href="/attribute"
              className="transition-colors hover:text-black"
            >
              属性克制
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
