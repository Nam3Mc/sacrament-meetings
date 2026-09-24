import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="text-center">
      <div className="relative w-full h-64 mb-6 rounded-lg overflow-hidden">
        <Image
          src="/chapel.jpg"
          alt="A peaceful chapel interior with wooden pews and soft lighting"
          fill
          className="object-cover"
          priority
        />
      </div>
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        Sacrament Meeting Planner
      </h1>
      <p className="text-gray-600 mb-6 max-w-lg mx-auto">
        Plan, review, and print sacrament meeting programs for your ward or
        branch. Track announcements, prayers, hymns, and speakers all in one
        place.
      </p>
      <Link
        href="/meetings"
        className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
      >
        View Meetings
      </Link>
    </div>
  );
}

// should be fine having an image 
