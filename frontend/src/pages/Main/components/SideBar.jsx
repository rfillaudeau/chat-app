import React, {useEffect, useState} from "react"
import {CanceledError} from "axios"
import CurrentUserCard from "./CurrentUserCard.jsx"
import Modal from "../../../components/ui/Modal.jsx"
import RoomCard from "./RoomCard.jsx"
import {useAuth} from "../../../contexts/AuthContext.jsx"
import {useRoom} from "../contexts/RoomContext.jsx"
import useMercure from "../../../hooks/useMercure.jsx"
import RoomForm from "./RoomForm.jsx"
import {useNavigate} from "react-router-dom"

function SideBar() {
    const {currentUser, api, isLoading} = useAuth()
    const {currentRoom, setCurrentRoom, rooms, setRooms} = useRoom()
    const [roomsToDisplay, setRoomsToDisplay] = useState([])
    const [searchRoom, setSearchRoom] = useState("")
    const [showNewRoomModal, setShowNewRoomModal] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        if (isLoading) {
            return
        }

        let controller = new AbortController()

        api.get("/rooms", {
            signal: controller.signal
        }).then(response => {
            setRooms(response.data["hydra:member"])
        }).catch(error => {
            if (error instanceof CanceledError) {
                return
            }

            console.error(error)
        })

        return () => controller.abort()
    }, [isLoading])

    useEffect(() => {
        const searchQuery = searchRoom
            .split(" ")
            .map(q => q.trim().toLowerCase())
            .filter(q => q.length > 0)

        setRoomsToDisplay(rooms.filter(room => {
            if (searchQuery.length === 0) {
                return true
            }

            const name = room.name.toLowerCase()
            for (const query of searchQuery) {
                if (name.includes(query)) {
                    return true
                }
            }

            return false
        }))
    }, [rooms, searchRoom])

    useMercure(`users/${currentUser.id}/rooms`, room => {
        addRoom(room)
    })

    function handleRoomCreation(room) {
        setShowNewRoomModal(false)

        addRoom(room)

        setCurrentRoom(room)
        navigate(`/room/${room.id}`)
    }

    function addRoom(room) {
        setRooms(prevRooms => {
            let newRooms = [...prevRooms]
            if (newRooms.find(r => r.id === room.id) == null) {
                newRooms.push(room)
            }

            return newRooms
        })
    }

    const roomElements = roomsToDisplay.map((room, index) => (
        <RoomCard
            key={index}
            room={room}
            isSelected={currentRoom !== null && room.id === currentRoom.id}
            onSelect={room => setCurrentRoom(room)}
        />
    ))

    return (
        <div className="flex w-1/4 flex-col px-6 py-4 space-y-4 bg-zinc-800">
            <CurrentUserCard/>

            <div className="flex items-center">
                <div className="grow text-lg font-bold">Rooms</div>

                <div>
                    <button
                        type="button"
                        className="text-center rounded-md bg-zinc-600 px-2 py-2 text-xs hover:bg-zinc-500"
                        onClick={() => setShowNewRoomModal(true)}
                    >
                        <i className="bi bi-plus-lg"></i> New room
                    </button>

                    <Modal
                        title="Create a new room"
                        isOpen={showNewRoomModal}
                        onClickOutside={() => setShowNewRoomModal(false)}
                        onClickClose={() => setShowNewRoomModal(false)}
                    >
                        <RoomForm
                            onSuccess={handleRoomCreation}
                        />
                    </Modal>
                </div>
            </div>

            <input
                type="text"
                className="rounded-2xl bg-zinc-700 px-3 py-2 text-sm text-zinc-400 border-transparent focus:border-transparent focus:ring-0 placeholder:text-zinc-500"
                placeholder="Search a room..."
                value={searchRoom}
                onChange={e => setSearchRoom(e.target.value)}
            />

            <div
                className="flex-grow overflow-auto space-y-2 scrollbar-thin scrollbar-thumb-zinc-500 scrollbar-track-transparent">
                {roomElements.length > 0 ? roomElements : <div className="text-center">No room found.</div>}
            </div>
        </div>
    )
}

export default SideBar
