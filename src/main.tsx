import React from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { SiteRoutes } from './Routes'
import './index.css'

const root = document.getElementById('root')!
const app = <React.StrictMode><BrowserRouter><SiteRoutes /></BrowserRouter></React.StrictMode>
if (root.hasChildNodes()) hydrateRoot(root, app)
else createRoot(root).render(app)
