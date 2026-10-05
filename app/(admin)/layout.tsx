import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect('/login');

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        Create Meeting
      </h1>
      {children}
    </div>
  );
}