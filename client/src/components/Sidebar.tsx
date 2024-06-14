interface SidebarProps {
  channels: string[]
}

export function Sidebar(props: SidebarProps) {
  return (
    <div class="flex flex-col">
      <Channels channels={props.channels} />
    </div>
  )

}


export function Channels({ channels }: { channels: string[] }) {
  return (
    <div class="flex flex-col">
      {
        channels.map((channel) => {
          return (
            <div class="flex items-center justify-center h-12 w-12 bg-gray-800 rounded-full cursor-pointer hover:bg-gray-700">
              <p class="text-white
                text-lg font-semibold">
                {channel}
              </p>
            </div>
          )
        })
      }

    </div>
  )
}
