import { useCallback } from "react";
import { RiMenuUnfold3Line, RiMenuFold3Line } from "react-icons/ri";
import { Link } from "react-router-dom";
import { useState } from "react"
import { FaHashtag } from "react-icons/fa6"

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

type ChannelProps = {
  id: string
  name: string

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

function Channel(props: ChannelProps) {
  return (
    <li>
      <a className="flex flex-row">
        <FaHashtag />
        <p>{props.name}</p>
      </a>
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

function Sidebar() {
  return (
    <>
      <div className="flex flex-row">
        <IdentitySwitcher className="hidden lg:block" />
        <label htmlFor="my-drawer-2" className="ml-auto m-2 btn btn-circle btn-outline drawer-button lg:hidden">
          <RiMenuFold3Line size="1.5em" />
        </label>
      </div>

      { /* everything in here scrolls */}
      <div className="overflow-y-auto h-full">
        <ChannelList />

      </div>

    </>
  )

}


function IdentitySwitcher(props: { className?: string }) {
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

  const identities: IdentityProps[] = [
    { id: "1", address: "chat.inkdocs.dev", image: null, onClick },
    { id: "2", address: "devs.inkchat.com", image: null, onClick },
    { id: "3", address: "diplomacy.com", image: null, onClick },
  ]
  const notSeletecdIdentities = identities.slice(1)

  return (
    <div className={`dropdown dropdown-bottom w-full mr-2 ${props.className}`}>
      <div tabIndex={0} role="button" onClick={onMainButtonClicked} className="btn btn-primary flex w-full my-2">
        <Identity {...identities[0]} onClick={() => { }} />
      </div>
      <ul tabIndex={0} className="dropdown-content mx-auto menu bg-base-100 rounded-box z-[1] w-full p-2 shadow">
        {
          notSeletecdIdentities.map((identity) => (
            <li key={identity.id} className="p-2">
              <Identity {...identity} />
            </li>
          ))
        }
      </ul>
    </div>
  )
}


interface IdentityProps {
  id: string;
  address: string;
  image: string | null;
  onClick: () => void;
}

function Identity(props: IdentityProps) {
  return (
    <Link className="flex flex-row items-center w-full" to={`/${props.address}/ldfjaskldfjasdlkfjas`} onClick={props.onClick}>
      <img src={props.image ?? "https://via.placeholder.com/150"} alt="server-icon" className="rounded-full w-8 h-8 mr-2" />
      <p>{props.address}</p>
    </Link>
  )
}
