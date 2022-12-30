import React, {useEffect, useState} from "react"
import {useUser} from "../../../contexts/UserContext"
import axios, {CanceledError} from "axios"
import CurrentUserCard from "./CurrentUserCard"
import RoomFormModal from "../../../components/RoomFormModal"
import RoomCard from "./RoomCard"

function SideBar({currentRoomId}) {
    const {currentUser} = useUser()
    const [rooms, setRooms] = useState([])

    useEffect(() => {
        if (currentUser === null) {
            return
        }

        let controller = new AbortController()

        axios.get("/api/rooms", {
            signal: controller.signal
        }).then(response => {
            console.log(response)

            setRooms(response.data)
        }).catch(error => {
            if (error instanceof CanceledError) {
                return
            }

            console.error(error)
        })

        return () => controller.abort()
    }, [currentUser])

    if (currentUser === null) {
        return
    }

    const roomElements = rooms.map((room, index) => (
        <RoomCard key={index} room={room} isSelected={room.id === currentRoomId}/>
    ))

    return (
        <div className="flex w-1/4 flex-col px-6 py-4 space-y-4 bg-zinc-800">
            <CurrentUserCard/>

            <div className="flex items-center">
                <div className="grow text-lg font-bold">Rooms</div>

                {/*<button type="button" className="text-center rounded-md bg-zinc-600 px-2 py-2 text-xs hover:bg-zinc-500">*/}
                {/*    New room*/}
                {/*</button>*/}
                <RoomFormModal/>
            </div>

            <input
                type="text"
                className="rounded-2xl bg-zinc-700 px-3 py-2 text-sm text-zinc-400 border-transparent focus:border-transparent focus:ring-0 placeholder:text-zinc-500"
                placeholder="Search a room..."
            />

            <div
                className="flex-grow overflow-auto space-y-2 scrollbar-thin scrollbar-thumb-zinc-500 scrollbar-track-transparent">
                {roomElements}
            </div>
        </div>
    )
}

export default SideBar
