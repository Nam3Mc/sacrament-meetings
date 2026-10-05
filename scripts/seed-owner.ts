import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

async function seed() {
  const email = 'admin@sacrament.app';
  const password = 'Password123!';
  const hash = await bcrypt.hash(password, 10);

  await sql`
    INSERT INTO users (name, email, password_hash)
    VALUES ('Bishopric Admin', ${email}, ${hash})
    ON CONFLICT (email) DO NOTHING
  `;

  console.log(`Seeded owner: ${email} / ${password}`);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});