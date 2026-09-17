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
      <div className="mx-auto max-w-4xl px-4 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Rexburg 3rd Ward</h1>
        <p className="text-sm text-blue-200">{formattedDate}</p>
      </div>
    </header>
  );
}