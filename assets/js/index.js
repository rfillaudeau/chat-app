import React, {StrictMode} from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import "../styles/app.css"
import "bootstrap-icons/font/bootstrap-icons.css"
import {BrowserRouter} from "react-router-dom"
import {UserContextProvider} from "./contexts/UserContext"

ReactDOM
    .createRoot(document.getElementById("root"))
    .render(
        <StrictMode>
            <UserContextProvider>
                <BrowserRouter>
                    <App/>
                </BrowserRouter>
            </UserContextProvider>
        </StrictMode>
    )
