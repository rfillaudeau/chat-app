import React, {useEffect, useRef, useState} from "react"
import {CanceledError} from "axios"
import Message from "./Message.jsx"
import MessageForm from "./MessageForm.jsx"
import {useAuth} from "../../../contexts/AuthContext.jsx"
import {useRoom} from "../contexts/RoomContext.jsx"
import useMercure from "../../../hooks/useMercure.jsx"

function RoomContainer() {
    const {api, isLoading} = useAuth()
    const {currentRoom} = useRoom()
    const [rawMessages, setRawMessages] = useState([])
    const [formattedMessages, setFormattedMessages] = useState([])
    const messagesBottomRef = useRef(null)

    useEffect(() => {
        if (currentRoom === null || isLoading) {
            return
        }

        let controller = new AbortController()

        api.get(`/rooms/${currentRoom.id}/messages`, {
            signal: controller.signal
        }).then(response => {
            setRawMessages(response.data["hydra:member"])
        }).catch(error => {
            if (error instanceof CanceledError) {
                return
            }

            console.error(error)
        })

        return () => controller.abort()
    }, [currentRoom, isLoading])

    useEffect(() => {
        // scroll to bottom every time messages change
        messagesBottomRef.current?.scrollIntoView({behavior: "smooth"})
    }, [formattedMessages])

    useEffect(() => {
        const messages = []
        let prevUserId = null
        for (const message of rawMessages) {
            if (prevUserId !== null && prevUserId === message.user.id) {
                messages[messages.length - 1].texts.push(message.text)
            } else {
                messages.push({
                    ...message,
                    texts: [message.text],
                    createdAt: new Date(message.createdAt)
                })
            }

            prevUserId = message.user.id
        }

        setFormattedMessages(messages)
    }, [rawMessages])

    useMercure(currentRoom === null ? null : `rooms/${currentRoom.id}`, message => {
        addRawMessage(message)
    })

    function addRawMessage(newMessage) {
        setRawMessages(prevMessages => {
            let messages = [...prevMessages]
            if (messages.find(m => m.id === newMessage.id) == null) {
                messages.push(newMessage)
            }

            return messages
        })
    }

    if (currentRoom === null) {
        return
    }

    const messageElements = formattedMessages.map((message, index) => (
        <Message key={index} message={message}/>
    ))

    return (
        <div className="flex w-3/4 flex-col px-6 py-4 bg-zinc-900">
            <div className="flex items-center rounded-t-2xl mb-4">
                <div className="grow">
                    <div className="text-lg font-bold">{currentRoom.name}</div>
                    <div className="text-sm">
                        <b>Users:</b> {currentRoom.users.map(userRoom => userRoom.user.username).join(", ")}
                    </div>
                </div>
                <button type="button"
                        className="text-center rounded-md bg-zinc-600 px-2 py-2 text-xs hover:bg-zinc-500">
                    <i className="bi bi-gear"></i> Room settings
                </button>
            </div>

            <div
                className="mb-4 grow overflow-auto scrollbar-thin scrollbar-thumb-zinc-500 scrollbar-track-transparent"
            >
                {messageElements.length > 0 ? messageElements : (
                    <div className="w-full h-full flex items-center justify-center">
                        <div>No message</div>
                    </div>
                )}

                <div ref={messagesBottomRef}></div>
            </div>

            <MessageForm room={currentRoom} onMessageSent={message => addRawMessage(message)}/>
        </div>
    )
}

export default RoomContainer
