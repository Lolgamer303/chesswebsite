import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold">Welcome to the Chess Website</h1>
      <p className="mt-4 text-lg">This is a simple chess website built with Next.js.</p>
      <Link href="/play" className="mt-6 text-blue-500 hover:underline">
        Play Chess
      </Link>
    </main>
  );










}