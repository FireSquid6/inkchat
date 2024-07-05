import { RiMenuUnfold3Line, RiMenuFold3Line } from "react-icons/ri";


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
        <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
          {/* Sidebar content here */}
          <Sidebar />

        </ul>
      </div>
    </div>)
}



function Topbar() {
  return (
    <div className="w-full flex flex-row bg-base-300">
      <label htmlFor="my-drawer-2" className="m-2 btn btn-circle btn-outline drawer-button lg:hidden">
        <RiMenuUnfold3Line size="1.5em" />
      </label>

    </div>
  )
}

function Sidebar() {
  return (
    <>
      <div className="flex flex-row">
        <IdentitySwitcher />
        <label htmlFor="my-drawer-2" className="ml-auto m-2 btn btn-circle btn-outline drawer-button lg:hidden">
          <RiMenuFold3Line size="1.5em" />
        </label>
      </div>
      <li><a>Sidebar Item 1</a></li>
      <li><a>Sidebar Item 2</a></li>
    </>
  )

}


function IdentitySwitcher() {
  const identities: IdentityProps[] = [
    { id: "1", address: "chat.inkdocs.dev", image: null },
    { id: "2", address: "devs.inkchat.com", image: null },
    { id: "3", address: "diplomacy.com", image: null },
  ]
  return (
    <div className="dropdown dropdown-bottom w-full mr-2">
      <div tabIndex={0} role="button" className="btn btn-primary w-full my-2">Swap Server</div>
      <ul tabIndex={0} className="dropdown-content mx-auto menu bg-base-100 rounded-box z-[1] w-full p-2 shadow">
        {
          identities.map((identity) => (
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
}

function Identity(props: IdentityProps) {
  return (
    <div className="flex flex-row items-center">
      <img src={props.image ?? "https://via.placeholder.com/150"} alt="server-icon" className="rounded-full w-8 h-8" />
      <p>{props.address}</p>
    </div>
  )
}
