import Link from 'next/link';

export default function Home() {
  return (
    <main style={{ padding: '4rem', textAlign: 'center' }}>
      <h1>Welcome to Student CRUD App</h1>
      <p>
        <Link href="/students">Go to Student Management →</Link>
      </p>
    </main>
  );
}