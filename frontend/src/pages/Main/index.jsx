import React, {useEffect} from "react"
import {useNavigate, useParams} from "react-router-dom"
import RoomContainer from "./components/RoomContainer.jsx"
import SideBar from "./components/SideBar.jsx"
import {useAuth} from "../../contexts/AuthContext.jsx"
import {RoomContextProvider} from "./contexts/RoomContext.jsx"

function Main() {
    const {isAuthenticated} = useAuth()
    const navigate = useNavigate()
    let {roomId: defaultRoomId} = useParams()
    defaultRoomId = defaultRoomId !== undefined ? parseInt(defaultRoomId) : null

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
            <RoomContextProvider defaultRoomId={defaultRoomId}>
                <SideBar/>

                <RoomContainer/>
            </RoomContextProvider>
        </div>
    )
}

export default Main
