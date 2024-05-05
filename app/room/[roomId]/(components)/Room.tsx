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
    if (userInfo.username !== presence.username) {
      if (userInfo.username) {
        updatePresence({ username: userInfo.username });
      } else {
        setUserInfo({ ...userInfo, username: presence.username });
      }
    }
  }, [userInfo, presence.username, updatePresence, setUserInfo]);

  useEffect(() => {
    if (!userInfo.id) {
      setUserInfo({ ...userInfo, id: presence.id });
    } else if (userInfo.id !== presence.id) {
      updatePresence({ id: userInfo.id });
    }
  }, [userInfo, presence.id, updatePresence, setUserInfo]);

  const clearEstimate = useMutation(({ storage }) => storage.get("data").get("estimates").delete(userInfo.id!), [userInfo.id]);
  const clearEstimates = useMutation(({ storage }) => storage.get("data").set("estimates", new LiveMap()), []);
  const updateEstimate = useMutation(
    ({ storage }, estimate: string) => storage.get("data").get("estimates").set(userInfo.id!, estimate),
    [userInfo.id]
  );
  const setEstimatesRevealed = useMutation(
    ({ storage }, estimatesRevealed: boolean) => storage.get("data").set("estimatesRevealed", estimatesRevealed),
    []
  );

  return (
    <div className="flex flex-col items-center gap-12">
      <ol className="grid w-full max-w-lg grid-cols-2 grid-rows-4 gap-4 md:grid-cols-4 md:grid-rows-2">
        {estimationValues.map((val) => (
          <li key={val} className="aspect-video">
            <button
              disabled={presence.isSpectator}
              onClick={() => updateEstimate(val)}
              className={`flex disabled:opacity-75 disabled:cursor-not-allowed items-center justify-center w-full h-full text-2xl font-bold text-gray-100 transition-colors bg-gray-500 border rounded-md shadow-md hover:bg-gray-400 ${
                selfEstimate === val ? "border-green-500 border-4" : "border-gray-300"
              }`}
            >
              {val}
            </button>
          </li>
        ))}
      </ol>
      <div className="grid w-full max-w-lg grid-cols-2 grid-rows-2 md:grid-cols-4 md:grid-rows-1 gap-4">
        <button
          className="px-4 font-bold py-2 text-gray-900 transition-colors bg-white border border-gray-300 rounded-md shadow-md hover:bg-gray-100"
          onClick={() => setEstimatesRevealed(!estimatesRevealed)}
        >
          {estimatesRevealed ? "Hide all" : "Reveal all"}
        </button>
        <button
          className="px-4 font-bold py-2 text-gray-900 transition-colors bg-white border border-gray-300 rounded-md shadow-md hover:bg-gray-100"
          onClick={clearEstimate}
        >
          Clear
        </button>
        <button
          className="px-4 font-bold py-2 text-gray-900 transition-colors bg-white border border-gray-300 rounded-md shadow-md hover:bg-gray-100"
          onClick={() => {
            setEstimatesRevealed(false);
            clearEstimates();
          }}
        >
          Clear all
        </button>
        <button
          className="px-4 font-bold py-2 text-gray-900 transition-colors bg-white border border-gray-300 rounded-md shadow-md hover:bg-gray-100"
          onClick={() => {
            updatePresence({ isSpectator: !presence.isSpectator });
            clearEstimate();
          }}
        >
          {presence.isSpectator ? "Participate" : "Spectate"}
        </button>
      </div>
    </div>
  );
}
