"use client";

import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const handleRoomCreate = () => {
    router.push(`/room/${Math.floor(Math.random() * 1e10).toString(16)}`);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-24">
      <h1 className="my-8 text-5xl font-bold text-center uppercase">Planning Poker</h1>
      <button
        className="px-4 py-2 text-gray-100 transition-colors bg-gray-500 border border-gray-300 rounded-md shadow-md hover:bg-gray-400"
        onClick={handleRoomCreate}
      >
        Create Room
      </button>
    </main>
  );
}