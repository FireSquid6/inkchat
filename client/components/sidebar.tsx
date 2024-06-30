import { FaHashtag } from "react-icons/fa6";

export type SidebarProps = {
  items: SidebarItemProps[]

}

export function Sidebar(props: SidebarProps) {
  return (
    <nav className="flex flex-1 flex-col">
      <div className="flex flex-1 flex-col gap-y-7">
        <div>
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            {props.items.map((item) => (
              <SidebarItem key={item.name} {...item} />
            ))}
          </ul>
        </div>
        <div className="-mx-6 mt-auto">
          <button className="flex items+enter gap-x-4 px-6 py-3 text-sm font-semibold elading-6 text-whtie hover:bg-gray-800">

          </button>
        </div>
      </div>
    </nav>
  )
}


type SidebarItemProps = {
  name: string;
}

function SidebarItem(props: SidebarItemProps) {
  return (
    <li>
      <button className="flex items-center gap-x-4">
        <FaHashtag />
        <span>{props.name}</span>
      </button>
    </li>
  )

} 
