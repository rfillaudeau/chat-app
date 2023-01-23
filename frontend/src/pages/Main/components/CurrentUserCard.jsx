import React, {useState} from "react"
import {useAuth} from "../../../contexts/AuthContext.jsx"
import Modal from "../../../components/ui/Modal.jsx"
import UserSettingsForm from "./UserSettingsForm.jsx"

function CurrentUserCard() {
    const {currentUser, logout} = useAuth()
    const [showSettingsModal, setShowSettingsModal] = useState(false)

    return (
        <>
            <div className="flex flex-col space-y-4 p-4 bg-zinc-900 rounded-2xl">
                <div className="flex items-center space-x-4">
                    <div
                        className="bg-zinc-400 h-10 w-10 rounded-xl text-zinc-800 flex items-center justify-center font-bold text-xl">
                        {currentUser.username[0].toUpperCase()}
                    </div>

                    <div className="grow min-w-0">
                        <div className="text-md font-bold truncate">
                            {currentUser.username}
                        </div>
                        <div className="text-xs truncate">
                            {currentUser.email}
                        </div>
                    </div>
                </div>

                <div className="flex space-x-2">
                    <button
                        type="button"
                        className="grow text-center rounded-md bg-zinc-600 px-2 py-2 text-xs hover:bg-zinc-500"
                        onClick={() => setShowSettingsModal(true)}
                    >
                        <i className="bi bi-gear"></i> Settings
                    </button>

                    <button
                        type="button"
                        className="block text-center rounded-md bg-zinc-600 px-2 py-2 text-xs hover:bg-zinc-500"
                        onClick={logout}
                    >
                        <i className="bi bi-escape"></i> Logout
                    </button>
                </div>
            </div>

            <Modal
                title="User settings"
                isOpen={showSettingsModal}
                onClickOutside={() => setShowSettingsModal(false)}
                onClickClose={() => setShowSettingsModal(false)}
            >
                <UserSettingsForm onSuccess={() => setShowSettingsModal(false)}/>
            </Modal>
        </>
    )
}

export default CurrentUserCard
