import { PublicUser } from "api"
import { ProfilePicture } from "./profile-picture"

export function ProfileCard(props: PublicUser & { avatarUrl: string }) {
  return (
    <div className="m-4 p-4 bg-base-200 w-[26rem] h-[32rem] border-neutral-500 border rounded-xl">
      <div className="flex flex-row">
        <ProfilePicture avatarUrl={props.avatarUrl} username={props.username} width={120} height={120} />
        <p className="text-4xl ml-4 my-auto align-middle">{props.displayName ?? props.username}</p>
      </div>
      <div>
        <p className="text-2xl mt-4">Username: <span className="font-mono">@{props.username}</span></p>
        <p className="text-lg mt-8">{props.bio ?? <span className="italic">This user has not set a bio</span>}</p>
      </div>
    </div>
  )
}

