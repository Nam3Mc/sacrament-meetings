'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/meetings', label: 'All Meetings' },
  { href: '/meetings/current', label: 'Current Meeting' },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-4 border-b border-gray-200 pb-2 mb-4">
      {links.map((link) => {
        const isActive =
          link.href === '/meetings'
            ? pathname === '/meetings'
            : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`px-3 py-1 rounded transition-colors ${
              isActive
                ? 'bg-blue-600 text-white'
                : 'text-blue-600 hover:bg-blue-50'
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}