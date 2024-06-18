interface TextInputProps {
  label: string;
  value: string;
  placeholder?: string;
  type?: string;
  className?: string;
  onChange: (value: string) => void;
}

export function TextInput(props: TextInputProps) {
  return (
    <div className={`${props.className}`}>
      <label>{props.label}</label>
      <input type={props.type ?? "text"} value={props.value} placeholder={props.placeholder} onChange={(e) => {
        props.onChange(e.target.value)
      }} />
    </div>
  )

}


interface ButtonProps {
  onClick: () => void;
  children?: React.ReactNode;
  className?: string;
  type?: "button" | "submit" | "reset";
}
export function Button(props: ButtonProps) {
  return (
    <button type={props.type ?? "button"} onClick={props.onClick} className={`${props.className}`}>
      <span>{props.children}</span>
    </button>
  )
}
