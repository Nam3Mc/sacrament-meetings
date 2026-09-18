import NavLinks from '@/components/NavLinks';

export default function MeetingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        Meetings
      </h1>
      <NavLinks />
      {children}
    </div>
  );
}