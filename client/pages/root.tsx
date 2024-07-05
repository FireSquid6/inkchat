import Layout from "@client/layout"
import { Outlet, useNavigate, useLocation } from "react-router-dom"
import { useEffect } from "react"


export function Root() {
  // TODO - use loaders or seomthing idk the docs don't like this
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (location.pathname === "/") {
      navigate("/home")
    }
  }, [])

  return (
    <Layout>
      <Outlet />
    </Layout>
  )
}
