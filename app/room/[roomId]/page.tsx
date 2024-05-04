"use client";

import { Room } from "./(components)/Room";
import { RoomProvider } from "@/liveblocks.config";
import { ClientSideSuspense } from "@liveblocks/react";
import UserAvatarDisplay from "./(components)/UserAvatarDisplay";
import { LiveMap, LiveObject } from "@liveblocks/client";
import { adjectives, animals, colors, uniqueNamesGenerator } from "unique-names-generator";

export default function Page({ params: { roomId } }: { params: { roomId: string } }) {
  return (
    <RoomProvider
      id={roomId}
      initialPresence={{
        id: Date.now().toString(16),
        username: uniqueNamesGenerator({ dictionaries: [adjectives, colors, animals], length: 2, separator: "-", seed: Date.now() }),
        isSpectator: false,
      }}
      initialStorage={{ data: new LiveObject({ estimates: new LiveMap(), estimatesRevealed: false }) }}
    >
      <main className="flex flex-col justify-center min-h-screen gap-24 p-4 pt-24 min-w-screen md:p-24">
        <ClientSideSuspense fallback={<div className="flex items-center justify-center flex-grow text-xl font-bold">Loading…</div>}>
          {() => (
            <>
              <UserAvatarDisplay />
              <Room />
            </>
          )}
        </ClientSideSuspense>
      </main>
    </RoomProvider>
  );
}
