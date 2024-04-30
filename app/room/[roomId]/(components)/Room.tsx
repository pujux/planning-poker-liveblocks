"use client";

import { useEffect } from "react";
import { useMutation, useMyPresence, useStorage } from "../../../../liveblocks.config";
import { useSessionStorage } from "@/app/utils/useSessionStorage";
import { LiveMap, shallow } from "@liveblocks/client";

const estimationValues = ["/", "0", "1", "2", "3", "5", "8", "13"];

export function Room() {
  const [userInfo, setUserInfo] = useSessionStorage<{ username?: string; id?: string }>("userData", {});
  const [presence, updatePresence] = useMyPresence();

  const selfEstimate = useStorage((storage) => storage.data.estimates.get(userInfo.id!), shallow);
  const estimatesRevealed = useStorage((storage) => storage.data.estimatesRevealed);

  useEffect(() => {
    if (userInfo.username && userInfo.username !== presence.username) {
      updatePresence({ username: userInfo.username });
    }
  }, [userInfo.username, presence.username, updatePresence]);

  useEffect(() => {
    if (!userInfo.id) {
      setUserInfo({ ...userInfo, id: presence.id });
    } else if (userInfo.id !== presence.id) {
      updatePresence({ id: userInfo.id });
    }
  }, [userInfo, presence.id, updatePresence, setUserInfo]);

  const clearEstimates = useMutation(({ storage }) => storage.get("data").set("estimates", new LiveMap()), []);
  const updateEstimate = useMutation(
    ({ storage }, userId: string, estimate: string) => storage.get("data").get("estimates").set(userId, estimate),
    []
  );
  const setEstimatesRevealed = useMutation(
    ({ storage }, estimatesRevealed: boolean) => storage.get("data").set("estimatesRevealed", estimatesRevealed),
    []
  );

  return (
    <div className="flex flex-col gap-8">
      <ol className="grid w-full max-w-lg grid-cols-2 grid-rows-4 gap-4 mx-auto md:grid-cols-4 md:grid-rows-2">
        {estimationValues.map((val) => (
          <li key={val} className="aspect-video">
            <button
              onClick={() => updateEstimate(userInfo.id!, val)}
              className={`flex items-center justify-center w-full h-full text-2xl font-bold text-gray-100 transition-colors bg-gray-500 border rounded-md shadow-md hover:bg-gray-400 ${
                selfEstimate === val ? "border-green-500 border-4" : "border-gray-300"
              }`}
            >
              {val}
            </button>
          </li>
        ))}
      </ol>
      <div className="flex items-center justify-center gap-4">
        <button
          className="px-4 py-2 text-gray-100 transition-colors bg-gray-500 border border-gray-300 rounded-md shadow-md hover:bg-gray-400"
          onClick={() => setEstimatesRevealed(!estimatesRevealed)}
        >
          {estimatesRevealed ? "Hide all" : "Reveal all"}
        </button>
        <button
          className="px-4 py-2 text-gray-100 transition-colors bg-gray-500 border border-gray-300 rounded-md shadow-md hover:bg-gray-400"
          onClick={() => {
            setEstimatesRevealed(false);
            clearEstimates();
          }}
        >
          Clear all
        </button>
      </div>
    </div>
  );
}
