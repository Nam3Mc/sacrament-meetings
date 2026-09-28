import Link from 'next/link';

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

        {/* Right: nav actions */}
        <nav className="flex flex-wrap items-center gap-2">
          <Link
            href="/"
            className="text-sm bg-blue-800 hover:bg-blue-700 px-3 py-1.5 rounded transition-colors"
          >
            Home
          </Link>
          <Link
            href="/meetings"
            className="text-sm bg-blue-800 hover:bg-blue-700 px-3 py-1.5 rounded transition-colors"
          >
            Meetings
          </Link>
          <Link
            href="/meetings/new"
            className="text-sm bg-white text-blue-900 hover:bg-blue-100 px-3 py-1.5 rounded font-medium transition-colors"
          >
            + New Meeting
          </Link>
        </nav>
      </div>
    </header>
  );
}