import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { Root } from './pages/root'
import { ConnectionProvider } from "./lib/context";
import { ErrorPage } from './error'
import { Channel } from "./pages/channel";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: ":address/:channelId",
        element: <Channel />,
      },
      {
        path: "home",
        element: <p>Hello world!</p>,
      }
    ]
  },

])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConnectionProvider>
      <RouterProvider router={router} />
    </ConnectionProvider>
  </React.StrictMode>,
)
