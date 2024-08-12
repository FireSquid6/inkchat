import { resolveError, useErrors } from "@/lib/error";
import { useEffect } from "react";
import { MdError } from "react-icons/md";

export function Toast() {
  const errors = useErrors()
  const entries = [...errors.entries()]

  return (
    <div className="toast toast-center toast-bottom">
      {entries.map(([key, error], index) => (
        <ErrorToast key={index} text={error} onClose={() => resolveError(key)} />
      ))}
    </div>
  )
}


type ErrorToastProps = {
  text: string
  onClose: () => void
}

function ErrorToast(props: ErrorToastProps) {
  useEffect(() => {
    setTimeout(() => {
      props.onClose()
    }, 5000)
  }, [])
  return (
    <button className="alert alert-error flex flex-row" onClick={props.onClose}>
      <MdError className="mr-2" />
      {props.text}
    </button>
  )
}
