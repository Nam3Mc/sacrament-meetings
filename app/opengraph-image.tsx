// app/opengraph-image.tsx
import { ImageResponse } from 'next/og';

export const alt = 'Sacrament Meeting Planner';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 64,
          background: '#1e3a8a',
          color: 'white',
        }}
      >
        Sacrament Meeting Planner
      </div>
    ),
    size
  );
}