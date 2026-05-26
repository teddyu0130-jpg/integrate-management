'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/home', label: 'ホーム' },
  { href: '/shopping', label: '買い物' },
  { href: '/settings', label: '設定' },
] as const;

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t border-zinc-200 bg-white">
      <ul className="flex">
        {NAV_ITEMS.map(({ href, label }) => {
          const isActive = pathname.startsWith(href);
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                className={`flex flex-col items-center py-2 text-xs transition-colors ${
                  isActive
                    ? 'text-zinc-900 font-semibold'
                    : 'text-zinc-400 hover:text-zinc-600'
                }`}
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
