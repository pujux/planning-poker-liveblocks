import { useSessionStorage } from "@/app/utils/useSessionStorage";
import { useOthers, useSelf, useStorage } from "@/liveblocks.config";
import Image from "next/image";

export default function UserAvatarDisplay({ style = "open-peeps" }: { style?: string }) {
  const [userInfo, setUserInfo] = useSessionStorage<{ username?: string; id?: string }>("userData", {});
  const presence = useSelf((self) => self.presence);
  const others = useOthers((others) =>
    others
      .reduce(
        (arr, other) => (arr.some((o) => other.presence.id === o.presence.id) || other.presence.id === presence.id ? arr : [...arr, other]),
        [] as typeof others
      )
      .map((o) => o.presence)
      .filter((p) => !!p.username && !!p.id)
  );

  const estimates = useStorage((storage) => storage.data.estimates);
  const estimatesRevealed = useStorage((storage) => storage.data.estimatesRevealed);

  const handleChangeUsername = () => {
    const input = prompt("Choose a username");
    if (input) {
      setUserInfo({ ...userInfo, username: input });
    }
  };

  const Avatar = ({ username = "Unknown", userId, index }: { username?: string; userId?: string; index: number }) => {
    return (
      <li className="w-1/3 md:w-1/5 lg:w-auto">
        <div
          onClick={index === 0 ? handleChangeUsername : undefined}
          data-tooltip={username}
          className={`relative mx-auto w-12 h-12 avatar place-content-center rounded-lg shadow-lg bg-white outline outline-2 ${
            index === 0 ? "outline-green-500" : "outline-gray-400"
          }`}
          style={{ zIndex: 50 - index }}
        >
          {estimatesRevealed && userId ? (
            <div className="flex items-center justify-center w-full h-full text-xl font-bold">{estimates.get(userId) ?? "?"}</div>
          ) : (
            <Image width={48} height={48} src={`https://api.dicebear.com/8.x/${style}/svg?seed=${userId ?? Math.random() * 1e6}`} alt={username} />
          )}
        </div>
      </li>
    );
  };

  return (
    <ul className="flex flex-wrap gap-4 gap-y-16 justify-evenly">
      <Avatar index={0} key={0} username={presence.username} userId={presence.id} />
      {others.map(({ username, id }, i) => (
        <Avatar index={i + 1} key={i + 1} username={username} userId={id} />
      ))}
    </ul>
  );
}
