export default function AmindLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        Create Meeting
      </h1>
      {children}
    </div>
  );
}