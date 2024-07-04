import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { Root } from './pages/root'
import Layout from "./layout";
import { ConnectionProvider } from "./lib/context";
import { ErrorPage } from './error'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/channels/:channelId",
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConnectionProvider>
      <Layout>
        <RouterProvider router={router} />
      </Layout>
    </ConnectionProvider>
  </React.StrictMode>,
)
