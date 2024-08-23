
export function ProfilePicture(props: { avatarUrl: string, username: string, width?: number, height?: number, className: string }) {
  return (
    <object type="image/png" className={`${props.className}`} data={props.avatarUrl} width={props.width ?? 120} height={props.height ?? 120}>
      <FallbackImage username={props.username} />
    </object>
  )
}

function FallbackImage({ username }: { username: string }) {
  return (
    <div className="bg-green-700 w-full h-full flex items-center justify-center rounded-full cursor-pointer">
      <p className="text-4xl text-white">{username[0]}</p>
    </div>
  )
}
