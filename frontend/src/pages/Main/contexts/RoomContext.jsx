import React, {createContext, useContext, useEffect, useState} from "react"

const RoomContext = createContext(null)

export function RoomContextProvider({children, defaultRoomId}) {
    const [rooms, setRooms] = useState([])
    const [currentRoom, setCurrentRoom] = useState(null)

    useEffect(() => {
        if (rooms.length === 0 || currentRoom !== null) {
            return
        }

        const defaultRoom = rooms.find(r => r.id === defaultRoomId)
        if (defaultRoom == null) {
            setCurrentRoom(rooms[0])
        } else {
            setCurrentRoom(defaultRoom)
        }
    }, [rooms])

    return (
        <RoomContext.Provider value={{
            rooms,
            setRooms,
            currentRoom,
            setCurrentRoom
        }}>
            {children}
        </RoomContext.Provider>
    )
}

export const useRoom = () => useContext(RoomContext)
