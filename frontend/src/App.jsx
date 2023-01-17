import React from "react"
import {Route, Routes} from "react-router-dom"
import Main from "./pages/Main/index.jsx"
import Login from "./pages/Login.jsx"
import Register from "./pages/Register.jsx"

function App() {
    return (
        <Routes>
            <Route path="/" element={<Main/>}/>
            <Route path="/room/:roomId" element={<Main/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/register" element={<Register/>}/>
            <Route path="/*" element={<div>Not found</div>}/>
        </Routes>
    )
}

export default App
