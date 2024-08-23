import { PublicUser } from "api"

export function ProfileCard(props: PublicUser & { avatarUrl: string }) {
  return (
    <div className="m-4 p-4 bg-base-200 w-[26rem] h-[32rem] border-neutral-500 border rounded-xl">
      <div className="flex flex-row">
        <object type="image/png" data={props.avatarUrl} width={120} height={120}>
          <FallbackImage username={props.username} />
        </object>
        <p className="text-4xl ml-4 my-auto align-middle">{props.displayName ?? props.username}</p>
      </div>
      <div>
        <p className="text-2xl mt-4">Username: <span className="font-mono">@{props.username}</span></p>
        <p className="text-lg mt-8">{props.bio ?? <span className="italic">This user has not set a bio</span>}</p>
      </div>
    </div>
  )
}

function FallbackImage({ username }: { username: string }) {
  return (
    <div className="bg-green-700 w-full h-full flex items-center justify-center rounded-full">
      <p className="text-4xl text-white">{username[0]}</p>
    </div>
  )
}
