import './style.css'
import "@kitajs/html/register"

document.querySelector<HTMLDivElement>('#app')!.innerHTML = App().toString()


function App(): JSX.Element {
  return (
    <div>
      Hello world!
      <AnotherComponent />
    </div>
  )
}



function AnotherComponent(): JSX.Element {
  return (
    <div>
      Another component
    </div>
  )
}
