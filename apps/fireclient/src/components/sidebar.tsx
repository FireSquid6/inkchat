import { RiMenuFold3Line, RiMenuUnfold3Line } from "react-icons/ri"
import {
  FaHashtag,
  FaHouse,
  FaLinkSlash,
  FaCircleInfo,
  FaGear
} from "react-icons/fa6"
import { MdPerson } from "react-icons/md"
import { channelStore, connectionStore, useConnectionState } from "@/lib/store"
import { useStore } from "@tanstack/react-store"
import { handleMaybe } from "maybe"
import { Link, useLocation } from "@tanstack/react-router"
import useSWR from "swr"

export function SidebarLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  const connection = useStore(connectionStore)
  let address = ""
  handleMaybe(
    connection,
    (conn) => {
      address = conn.address
    },
    () => {}
  )

  return (
    <div className="drawer lg:drawer-open h-screen">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <main className="drawer-content h-screen overflow-y-auto">
        <Topbar />

        {children}
      </main>
      <div className="drawer-side">
        <label
          htmlFor="my-drawer-2"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <div className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
          <Sidebar />
        </div>
      </div>
    </div>
  )
}

// only shows up on small screens
export function Topbar() {
  return (
    <div className="w-full flex flex-row bg-base-300 lg:hidden">
      <label
        htmlFor="my-drawer-2"
        className="m-2 btn btn-circle btn-outline drawer-button"
      >
        <RiMenuUnfold3Line size="1.5em" />
      </label>
    </div>
  )
}

export function Sidebar() {
  const connectionState = useConnectionState()
  return (
    <>
      <div className="flex flex-row">
        <label
          htmlFor="my-drawer-2"
          className="ml-auto m-2 btn btn-circle btn-outline drawer-button lg:hidden"
        >
          <RiMenuFold3Line size="1.5em" />
        </label>
      </div>
      <QuickLinks />
      <hr className="my-2" />
      {connectionState.successful && !connectionState.pending ? (
        <div className="overflow-y-auto h-full">
          <ChannelList />
        </div>
      ) : (
        <NotConnected error={connectionState.error} />
      )}
    </>
  )
}

function QuickLinks() {
  // TODO: make settings disappear if you're not an admin
  // TODO: make the links work properly depending on the current connection
  const { data: connection } = useStore(connectionStore)
  let quickLinks: QuickLinkProps[] = [
    { icon: <FaHouse />, text: "Back to Connections", to: "/" }
  ]

  if (connection !== null) {
    quickLinks = quickLinks.concat([
      {
        icon: <MdPerson />,
        text: "Profile",
        to: `/server/${connection.address}/profile`
      },
      {
        icon: <FaCircleInfo />,
        text: "About",
        to: `/server/${connection.address}/`
      },
      {
        icon: <FaGear />,
        text: "Settings",
        to: `/server/${connection.address}/admin`
      }
    ])
  }

  return (
    <ul className="flex flex-col">
      {quickLinks.map((quickLink, i) => (
        <QuickLink key={i} {...quickLink} />
      ))}
    </ul>
  )
}

type QuickLinkProps = {
  icon: React.ReactNode
  text: string
  to: string
}

function QuickLink(props: QuickLinkProps) {
  return (
    <li className="w-full">
      <Link to={props.to} className="flex flex-row items-center">
        {props.icon}
        <p className="font-bold">{props.text}</p>
      </Link>
    </li>
  )
}

function ChannelList() {
  const channels = useStore(channelStore)

  return (
    <ul className="flex flex-col">
      {channels.map((channel) => (
        <Channel key={channel.id} {...channel} />
      ))}
    </ul>
  )
}

type ChannelProps = {
  id: string
  name: string
}
function Channel(props: ChannelProps) {
  let location = useLocation().pathname.split("/")
  if (location.length > 3) {
    // cut everything after the third slash
    location = location.slice(0, 3)
  }
  location.push(props.id)

  return (
    <li>
      <Link className="flex flex-row" to={location.join("/")}>
        <FaHashtag />
        <p>{props.name}</p>
      </Link>
    </li>
  )
}

type NotConnectedProps = {
  error?: string
}
function NotConnected(props: NotConnectedProps) {
  return (
    <div className="flex flex-col items-center justify-center my-12 h-full">
      <FaLinkSlash size="8em" className="my-8" />
      <p className="text-xl">Not connected to any server</p>
      <p className="text-error">{props.error}</p>
    </div>
  )
}
