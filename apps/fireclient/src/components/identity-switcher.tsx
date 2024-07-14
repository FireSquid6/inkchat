"use client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useCallback } from "react";
import Link from "next/link";
import { FaPlus } from "react-icons/fa"

export function IdentitySwitcher(props: { className?: string }) {
  const identities: IdentityProps[] = []
  let selectedIdentity: IdentityProps | null = null
  selectedIdentity = {
    id: "1",
    address: "test",
    image: null,
  }

  // const res = getStoredSessions()

  // if (isSome(res)) {
  //   for (const session of res.data) {
  //     if (session.address === connection.address) {
  //       selectedIdentity = {
  //         id: session.token,
  //         address: session.address,
  //         image: null,
  //       }
  //     } else {
  //       identities.push({
  //         id: session.token,
  //         address: session.address,
  //         image: null,
  //       })
  //     }
  //   }
  // }


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
          <Link className="flex flex-row items-center w-full" href="/auth" onClick={onClick}>
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
  const router = useRouter()
  const onClick = () => {
    if (props.onClick) {
      props.onClick()
    }
    
    router.push(`/${props.address}`)
  }
  return (
    <button className="flex flex-row items-center w-full" onClick={onClick}>
      <img src={props.image ?? "https://via.placeholder.com/150"} alt="server-icon" className="rounded-full w-8 h-8 mr-2" />
      <p>{props.address}</p>
    </button>
  )
}
