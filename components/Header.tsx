import Link from 'next/link';
import { AuthNav } from '@/components/auth-nav';

export default function Header() {
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className="bg-blue-900 text-white shadow-md">
      <div className="mx-auto max-w-4xl px-4 py-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        {/* Left: brand + date */}
        <div>
          <h1 className="text-xl font-bold">
            <Link href="/" className="hover:text-blue-200 transition-colors">
              Rexburg 3rd Ward
            </Link>
          </h1>
          <p className="text-sm text-blue-200">{formattedDate}</p>
        </div>

        {/* Right: nav actions (auth-aware) */}
        <AuthNav />
      </div>
    </header>
  );
}