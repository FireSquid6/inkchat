import { Router, Route } from "@solidjs/router"
import { Root } from "./routes/Root";
import { Layout } from "./Layout";

function App() {
  return (
    <Layout>
      <Router>
        <Route path="/" component={Root}/>
      </Router>
    </Layout>
  )
}

export default App
