import { RiMenuUnfold3Line, RiMenuFold3Line } from "react-icons/ri";
import Link from "next/link";
import { FaHashtag, FaHouse, FaLinkSlash } from "react-icons/fa6"
import { IdentitySwitcher } from "@/components/identity-switcher"

export function Sidebar() {
  // TODO: show the channel list if you're connected
  return (
    <>
      <div className="flex flex-row">
        <IdentitySwitcher className="hidden lg:block" />
        <label htmlFor="my-drawer-2" className="ml-auto m-2 btn btn-circle btn-outline drawer-button lg:hidden">
          <RiMenuFold3Line size="1.5em" />
        </label>
      </div>
      <QuickLinks />
      <hr className="my-2" />
      {false ? (
        <div className="overflow-y-auto h-full">
          <ChannelList />

        </div>) : (
        <NotConnected />
      )
      }
    </>
  )
}

function QuickLinks() {
  // TODO: make settings disappear if you're not an admin
  // TODO: make the links work properly depending on the current connection
  const quickLinks: QuickLinkProps[] = [
    { icon: <FaHouse />, text: "Home", to: "/home" },
  ]
  
  // if (connection.active) {
  //   quickLinks.concat([
  //     { icon: <MdPerson />, text: "Profile", to: `/${connection.address}/profile` }, 
  //     { icon: <FaCircleInfo />, text: "About", to: `/${connection.address}/about` },
  //     { icon: <FaGear />, text: "Settings", to: `/${connection.address}/settings`},
  //   ])
  // }

  return (
    <ul className="flex flex-col">
      {
        quickLinks.map((quickLink, i) => (
          <QuickLink key={i} {...quickLink} />
        ))
      }
    </ul>
  )
}

type QuickLinkProps = {
  icon: React.ReactNode
  text: string
  to: string
}

function QuickLink(props: QuickLinkProps) {
  "use client"
  return (
    <li className="w-full">
      <Link href={props.to} className="flex flex-row items-center">
        {props.icon}
        <p className="font-bold">{props.text}</p>
      </Link>
    </li>
  )
}


function ChannelList() {
  const channels: ChannelProps[] = [
    { id: "1", name: "general" },
    { id: "2", name: "random" },
    { id: "3", name: "off-topic" },
  ]

  return (
    <ul className="flex flex-col">
      {
        channels.map((channel) => (
          <Channel key={channel.id} {...channel} />
        ))
      }
    </ul>
  )
}

type ChannelProps = {
  id: string
  name: string

}
function Channel(props: ChannelProps) {
  return (
    <li>
      <Link className="flex flex-row" href={props.id}>
        <FaHashtag />
        <p>{props.name}</p>
      </Link>
    </li>
  )
}

function NotConnected() {
  return (
    <div className="flex flex-col items-center justify-center my-12 h-full">
      <FaLinkSlash size="8em" className="my-8" />
      <p className="text-xl">Not connected to any server</p>
    </div>
  )
}
