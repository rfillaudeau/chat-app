import React, {useEffect, useRef, useState} from "react"
import {useUser} from "../../../contexts/UserContext"
import axios, {CanceledError} from "axios"
import Message from "./Message"

function RoomContainer({currentRoomId}) {
    const {currentUser} = useUser()
    const [rawMessages, setRawMessages] = useState([])
    const [formattedMessages, setFormattedMessages] = useState([])
    const submitButtonRef = useRef(null)
    const newMessageInputRef = useRef(null)
    const messagesBottomRef = useRef(null)

    useEffect(() => {
        if (currentUser === null || currentRoomId === null) {
            return
        }

        let controller = new AbortController()

        axios.get(`/api/rooms/${currentRoomId}/messages`, {
            signal: controller.signal
        }).then(response => {
            console.log(response.data)

            setRawMessages(response.data)
        }).catch(error => {
            if (error instanceof CanceledError) {
                return
            }

            console.error(error)
        })

        return () => controller.abort()
    }, [currentUser, currentRoomId])

    useEffect(() => {
        if (currentUser === null || currentRoomId === null) {
            return
        }

        const hub = new URL(document.mercureLink)

        hub.searchParams.append("topic", `rooms/${currentRoomId}`)

        // Subscribe to updates
        const eventSource = new EventSource(hub)
        eventSource.onmessage = event => {
            const message = JSON.parse(event.data)

            setRawMessages(prevMessages => [...prevMessages, message])
        }

        return () => {
            console.log("Event source closed")

            eventSource.close()
        }
    }, [currentUser, currentRoomId])

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

    useEffect(() => {
        if (newMessageInputRef.current === null) {
            return
        }

        newMessageInputRef.current.value = ""
    }, [currentRoomId])

    if (currentUser === null || currentRoomId === null) {
        return
    }

    const messageElements = formattedMessages.map((message, index) => (
        <Message key={index} message={message}/>
    ))

    function handleSendMessage(event) {
        event.preventDefault()

        const text = newMessageInputRef.current.value
        if (text.length === 0) {
            return
        }

        submitButtonRef.current.disabled = true

        axios.post(`/api/rooms/${currentRoomId}/messages`, {text}).then(response => {
            console.log(response)
        }).catch(error => {
            console.error(error)
        }).finally(() => {
            newMessageInputRef.current.value = ""

            submitButtonRef.current.disabled = false
        })
    }

    return (
        <div className="flex w-3/4 flex-col px-6 py-4 bg-zinc-900">
            <div className="flex items-center rounded-t-2xl mb-4">
                <div className="grow text-lg font-bold">
                    My Awesome room
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

            <form
                className="flex items-center bg-zinc-800 px-4 py-2 rounded-2xl space-x-4"
                onSubmit={handleSendMessage}
            >
                <input
                    type="text"
                    className="grow text-sm px-0 py-2 bg-transparent border-transparent focus:border-transparent focus:ring-0 placeholder:text-zinc-500"
                    placeholder="Write a message..."
                    ref={newMessageInputRef}
                />

                <button
                    type="submit"
                    className="text-center rounded-md bg-zinc-600 px-4 py-2 text-sm hover:bg-zinc-500"
                    ref={submitButtonRef}
                >
                    <i className="bi bi-send-fill"/>
                </button>
            </form>
        </div>
    )
}

export default RoomContainer
