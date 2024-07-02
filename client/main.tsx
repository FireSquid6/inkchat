import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import Layout from './layout'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Layout>
      <p className="text-3xl">Hello, world!</p>
    </Layout>
  </React.StrictMode>,
)
