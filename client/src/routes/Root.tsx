import { Sidebar } from "../components/Sidebar";

export function Root() {
  return (
    <div class="flex flex-row">
      <Sidebar channels={[
        "general",
        "random",
        "react",
        "solid",
      ]} />

    </div>
  )
}
