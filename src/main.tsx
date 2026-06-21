import "@framer/plugin/framer.css"

import React from "react"
import ReactDOM from "react-dom/client"
import { App } from "./App"
import "./styles/globals.css"

import { framer } from "@framer/plugin"

const root = document.getElementById("root")
if (!root) throw new Error("Root element not found")

framer.showUI({
  position: "top right",
  width: 320,
  height: 500,
})

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
