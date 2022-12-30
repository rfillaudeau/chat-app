import React, {useEffect} from "react"
import {useUser} from "../../contexts/UserContext"
import {useNavigate, useParams} from "react-router-dom"
import RoomContainer from "./components/RoomContainer"
import SideBar from "./components/SideBar"

function Main() {
    const {currentUser} = useUser()
    const navigate = useNavigate()
    let {roomId: currentRoomId} = useParams()
    currentRoomId = currentRoomId !== undefined ? parseInt(currentRoomId) : null

    useEffect(() => {
        if (currentUser === null) {
            navigate("/login")
        }
    }, [currentUser])

    if (currentUser === null) {
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
