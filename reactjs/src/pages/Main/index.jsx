import React, {useEffect} from "react"
import {useNavigate, useParams} from "react-router-dom"
import RoomContainer from "./components/RoomContainer.jsx"
import SideBar from "./components/SideBar.jsx"
import {useAuth} from "../../contexts/AuthContext.jsx"

function Main() {
    const {isAuthenticated} = useAuth()
    const navigate = useNavigate()
    let {roomId: currentRoomId} = useParams()
    currentRoomId = currentRoomId !== undefined ? parseInt(currentRoomId) : null

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/login")
        }
    }, [isAuthenticated])

    if (!isAuthenticated) {
        return
    }

    return (
        <div className="flex h-screen text-zinc-300">
            <SideBar currentRoomId={currentRoomId}/>

            <RoomContainer currentRoomId={currentRoomId}/>
        </div>
    )
}

export default Main
