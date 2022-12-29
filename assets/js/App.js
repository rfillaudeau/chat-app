import React from "react"
import { Route, Routes } from "react-router-dom"
import Main from "./pages/Main"
import Login from "./pages/Login"
import Register from "./pages/Register"
import MercureTest from "./pages/MercureTest"

function App() {
    return (
        <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/mercure" element={<MercureTest />} />
            <Route path="/*" element={<div>Not found</div>} />
        </Routes>
    )
}

export default App
