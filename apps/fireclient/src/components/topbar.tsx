import { IdentitySwitcher } from "@/components/identity-switcher"
import { RiMenuUnfold3Line } from "react-icons/ri";


// only shows up on small screens
export function Topbar() {
  return (
    <div className="w-full flex flex-row bg-base-300 lg:hidden">
      <label htmlFor="my-drawer-2" className="m-2 btn btn-circle btn-outline drawer-button">
        <RiMenuUnfold3Line size="1.5em" />
      </label>
      <IdentitySwitcher className="ml-auto max-w-60" />
    </div>
  )
}
