import type { JSX } from "solid-js"

export function Layout(props: { children: JSX.Element }) {
  return (
    <div class="layout">
      <main>{props.children}</main>
    </div>
  )

}
