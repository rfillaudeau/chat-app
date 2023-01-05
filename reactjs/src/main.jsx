import React, {StrictMode} from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import "./index.css"
import "bootstrap-icons/font/bootstrap-icons.css"
import {UserContextProvider} from "./contexts/UserContext.jsx"
import {BrowserRouter} from "react-router-dom"

ReactDOM.createRoot(document.getElementById("root")).render(
    <StrictMode>
        <UserContextProvider>
            <BrowserRouter>
                <App/>
            </BrowserRouter>
        </UserContextProvider>
    </StrictMode>,
)
