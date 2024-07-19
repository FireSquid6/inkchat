import { Link } from "@tanstack/react-router"


export function Header() {
  return (
    <div className="navbar bg-base-200">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl">Fireclient</a>
      </div>
      <div className="flex-none">

      </div>
    </div>
  )
}

type NavbarItemProps = {
  href: string
  children: React.ReactNode
}

function NavbarItem(props: NavbarItemProps) {
  return (
    <Link className="btn btn-square btn-ghost" to={props.href}>
      { props.children }
    </Link>
  )
}
