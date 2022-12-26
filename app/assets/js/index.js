import React, {StrictMode} from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-icons/font/bootstrap-icons.css"
import "../styles/app.css"
import "bootstrap/dist/js/bootstrap.min"
import {BrowserRouter} from "react-router-dom"

ReactDOM
    .createRoot(document.getElementById("root"))
    .render(
        <StrictMode>
            <BrowserRouter>
                <App/>
            </BrowserRouter>
        </StrictMode>
    )
