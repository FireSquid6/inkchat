import { useCallback } from "react";
import { RiMenuUnfold3Line, RiMenuFold3Line } from "react-icons/ri";
import { Link } from "react-router-dom";
import { useState } from "react"
import { FaHashtag, FaHouse, FaPlus, FaLinkSlash, FaCircleInfo, FaGear } from "react-icons/fa6"
import { useConnection } from "./lib/context";
import { getStoredSessions } from "./lib/auth";
import { isSome } from "@/maybe";
import { MdPerson } from "react-icons/md"

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <main className="drawer-content h-screen">
        <Topbar />

        {children}
      </main>
      <div className="drawer-side">
        <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
        <div className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
          <Sidebar />

        </div>
      </div>
    </div>)
}

function Sidebar() {
  const connection = useConnection()
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
      {connection.active ? (
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
  const connection = useConnection()
  const quickLinks: QuickLinkProps[] = [
    { icon: <FaHouse />, text: "Home", to: "/home" },
  ]
  
  if (connection.active) {
    quickLinks.concat([
      { icon: <MdPerson />, text: "Profile", to: `/${connection.address}/profile` }, 
      { icon: <FaCircleInfo />, text: "About", to: `/${connection.address}/about` },
      { icon: <FaGear />, text: "Settings", to: `/${connection.address}/settings`},
    ])
  }

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
      <Link className="flex flex-row" to={props.id}>
        <FaHashtag />
        <p>{props.name}</p>
      </Link>
    </li>
  )
}

// only shows up on small screens
function Topbar() {
  return (
    <div className="w-full flex flex-row bg-base-300 lg:hidden">
      <label htmlFor="my-drawer-2" className="m-2 btn btn-circle btn-outline drawer-button">
        <RiMenuUnfold3Line size="1.5em" />
      </label>
      <IdentitySwitcher className="ml-auto max-w-60" />

    </div>
  )
}




function IdentitySwitcher(props: { className?: string }) {
  const connection = useConnection()
  const identities: IdentityProps[] = []
  let selectedIdentity: IdentityProps | null = null

  const res = getStoredSessions()

  if (isSome(res)) {
    for (const session of res.data) {
      if (session.address === connection.address) {
        selectedIdentity = {
          id: session.token,
          address: session.address,
          image: null,
        }
      } else {
        identities.push({
          id: session.token,
          address: session.address,
          image: null,
        })
      }
    }
  }


  // Handles some UI stuff
  const [toggle, setToggle] = useState(false)
  const onClick = useCallback(() => {
    const elem = document.activeElement as HTMLElement
    if (elem) {
      elem.blur()
    }
  }, [])
  const onMainButtonClicked = useCallback(() => {
    if (toggle) {
      const elem = document.activeElement as HTMLElement
      if (elem) {
        elem.blur()
      }

      setToggle(false)
    } else {
      setToggle(true)
    }
  }, [toggle, setToggle])


  return (
    <div className={`dropdown dropdown-bottom w-full mr-2 lg:mr-0 ${props.className}`}>
      <div tabIndex={0} role="button" onClick={onMainButtonClicked} className="btn btn-primary flex w-full my-2">
        {
          selectedIdentity === null ? (
            <p>---------------</p>
          ) : (
            <Identity {...selectedIdentity} onClick={() => { }} />
          )
        }
      </div>
      <ul tabIndex={0} className="dropdown-content mx-auto menu bg-base-100 rounded-box z-[1] w-full p-2 shadow">
        {
          identities.map((identity) => (
            <li key={identity.id} className="p-2">
              <Identity {...identity} onClick={onClick} />
            </li>
          ))
        }
        <li>
          <Link className="flex flex-row items-center w-full" to="/auth" onClick={onClick}>
            <FaPlus />
            <p>New identity</p>
          </Link>
        </li>
      </ul>
    </div>
  )
}


interface IdentityProps {
  id: string;
  address: string;
  image: string | null;
  onClick?: () => void;
}

function Identity(props: IdentityProps) {
  return (
    <Link className="flex flex-row items-center w-full" to={`/${props.address}/ldfjaskldfjasdlkfjas`} onClick={props.onClick}>
      <img src={props.image ?? "https://via.placeholder.com/150"} alt="server-icon" className="rounded-full w-8 h-8 mr-2" />
      <p>{props.address}</p>
    </Link>
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
