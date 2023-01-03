import React from "react"

function Message({message}) {
    const dateFormat = Intl.DateTimeFormat("en-us", {
        dateStyle: "long",
        timeStyle: "long"
    })

    function getAgo(date) {
        const diff = date - new Date()
        const seconds = diff / 1000
        const minutes = seconds / 60
        const hours = minutes / 60
        const days = hours / 24

        const formatter = new Intl.RelativeTimeFormat("en-US", {
            numeric: "auto",
        })

        if (days <= -1) {
            return formatter.format(Math.round(days), "day")
        }

        if (hours <= -1) {
            return formatter.format(Math.round(hours), "hour")
        }

        if (minutes <= -1) {
            return formatter.format(Math.round(minutes), "minute")
        }

        return formatter.format(Math.round(seconds), "second")
    }

    const textElements = message.texts.map((text, index) => (
        <div key={index}>
            <div className="inline-block rounded-2xl rounded-tl-sm bg-zinc-800 px-4 py-2 text-sm">
                {text}
            </div>
        </div>
    ))

    return (
        <div className="flex px-0 py-3 space-x-4">
            <img
                src="https://picsum.photos/id/13/200/200"
                alt="..."
                className="h-8 w-8 rounded-xl"
            />
            <div className="grow space-y-2 min-w-0 flex flex-col">
                <div className="space-x-2 flex items-center">
                    <div className="text-sm font-bold text-gray-200 truncate">
                        {message.user.username}
                    </div>
                    <div className="shrink-0 text-xs text-gray-400" title={dateFormat.format(message.createdAt)}>
                        {getAgo(message.createdAt)}
                    </div>
                </div>

                {textElements}
            </div>
        </div>
    )
}

export default Message
