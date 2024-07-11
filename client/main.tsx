import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { Root } from './pages/root'
import { ErrorPage } from './error'
import { ChannelPage } from "./pages/channel";
import { AuthPage } from './pages/auth'
import { InfoPage } from './pages/info'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: ":address/:channelId",
        element: <ChannelPage />,
      },
      {
        path: ":address",
        element: <InfoPage />,
      },
      {
        path: "home",
        element: <p>Hello world!</p>,
      },
      {
        path: "auth",
        element: <AuthPage />
      }
    ]
  },

])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
