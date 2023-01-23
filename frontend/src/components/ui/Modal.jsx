import React, {Fragment} from "react"
import {Dialog, Transition} from "@headlessui/react"

function Modal({children, title, isOpen, onClickOutside, onClickClose}) {
    function handleOutsideClick() {
        if (onClickOutside instanceof Function) {
            onClickOutside()
        }
    }

    function handleCloseClick() {
        if (onClickClose instanceof Function) {
            onClickClose()
        }
    }

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={handleOutsideClick}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-50"/>
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel
                                className="w-full max-w-md transform overflow-hidden rounded-2xl text-zinc-200 bg-zinc-800 p-6 text-left align-middle shadow-xl transition-all">
                                <div className="flex items-start space-x-2">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg font-medium leading-6 mb-3 grow"
                                    >
                                        {title}
                                    </Dialog.Title>

                                    <div
                                        className="flex items-center justify-center w-6 h-6 hover:cursor-pointer"
                                        onClick={handleCloseClick}
                                        title="Close"
                                    >
                                        <i className="bi bi-x-lg"></i>
                                    </div>
                                </div>

                                {children}
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}

export default Modal
