import Html from "@kitajs/html"

interface TextInputProps {
  id: string
  label: string;
  placeholder: string;
  type?: string
  class?: string
}

export function TextInput(props: TextInputProps) {
  return (
    <label for={props.id} class={`input m-4 input-bordered flex items-center gap-2 ${props.class}`}>
      <span safe class="font-bold w-24">{props.label}</span>
      <input type={props.type ?? "text"} id={props.id} placeholder={props.placeholder} />
    </label>
  )
}

interface ButtonProps {
  id?: string
  children?: Html.Children
  type?: 'submit' | 'button'
  onclick?: string
  class?: string
}

export function Button(props: ButtonProps) {
  return (
    <button id={props.id} class={`btn m-4 ${props.class}`} type={props.type ?? "buton"}>
      {props.children}
    </button>
  )
}
