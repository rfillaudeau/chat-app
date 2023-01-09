import React, {StrictMode} from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import "./index.css"
import "bootstrap-icons/font/bootstrap-icons.css"
import {BrowserRouter} from "react-router-dom"
import {AuthContextProvider} from "./contexts/AuthContext.jsx"

ReactDOM.createRoot(document.getElementById("root")).render(
    <StrictMode>
        <AuthContextProvider>
            <BrowserRouter>
                <App/>
            </BrowserRouter>
        </AuthContextProvider>
    </StrictMode>,
)
