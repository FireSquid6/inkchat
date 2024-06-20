export function setPage(element: JSX.Element) {
  document.querySelector<HTMLDivElement>('#page')!.innerHTML = element.toString()
}
