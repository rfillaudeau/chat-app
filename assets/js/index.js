import React, { StrictMode } from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import "../styles/app.css"
import "bootstrap-icons/font/bootstrap-icons.css"
import { BrowserRouter } from "react-router-dom"

ReactDOM
    .createRoot(document.getElementById("root"))
    .render(
        <StrictMode>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </StrictMode>
    )
