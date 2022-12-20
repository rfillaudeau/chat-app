import React from "react"

function SideBar() {
    return (
        <div className="d-flex flex-column p-3">
            <div className="mb-3">
                <div className="d-flex align-items-center mb-3">
                    <div>
                        <img src="https://picsum.photos/id/230/200" className="rounded avatar-sm" alt="..."/>
                    </div>
                    <div className="flex-fill mx-3">Username</div>
                    <div>
                        <button className="btn btn-sm btn-outline-secondary me-2">
                            <i className="bi bi-gear"></i>
                        </button>
                        <button className="btn btn-sm btn-outline-secondary">
                            <i className="bi bi-power"></i>
                        </button>
                    </div>
                </div>

                <div className="d-flex">
                    <button className="btn btn-primary w-100">Create a new room</button>
                </div>
            </div>
            <div className="flex-fill mb-auto">
                <div className="h5 mb-3">Rooms</div>

                <div className="list-group list-group-flush overflow-auto">
                    <a href="#" className="list-group-item list-group-item-action active py-3 lh-sm"
                       aria-current="true">
                        <div className="d-flex w-100 align-items-center justify-content-between">
                            <strong className="mb-1">List group item heading</strong>
                            <small>Wed</small>
                        </div>
                        <div className="col-10 mb-1 small">Some placeholder content in a paragraph below the heading and
                            date.
                        </div>
                    </a>
                    <a href="#" className="list-group-item list-group-item-action py-3 lh-sm">
                        <div className="d-flex w-100 align-items-center justify-content-between">
                            <strong className="mb-1">List group item heading</strong>
                            <small className="text-muted">Tues</small>
                        </div>
                        <div className="col-10 mb-1 small">Some placeholder content in a paragraph below the heading and
                            date.
                        </div>
                    </a>
                    <a href="#" className="list-group-item list-group-item-action py-3 lh-sm">
                        <div className="d-flex w-100 align-items-center justify-content-between">
                            <strong className="mb-1">List group item heading</strong>
                            <small className="text-muted">Mon</small>
                        </div>
                        <div className="col-10 mb-1 small">Some placeholder content in a paragraph below the heading and
                            date.
                        </div>
                    </a>

                    <a href="#" className="list-group-item list-group-item-action py-3 lh-sm" aria-current="true">
                        <div className="d-flex w-100 align-items-center justify-content-between">
                            <strong className="mb-1">List group item heading</strong>
                            <small className="text-muted">Wed</small>
                        </div>
                        <div className="col-10 mb-1 small">Some placeholder content in a paragraph below the heading and
                            date.
                        </div>
                    </a>
                    <a href="#" className="list-group-item list-group-item-action py-3 lh-sm">
                        <div className="d-flex w-100 align-items-center justify-content-between">
                            <strong className="mb-1">List group item heading</strong>
                            <small className="text-muted">Tues</small>
                        </div>
                        <div className="col-10 mb-1 small">Some placeholder content in a paragraph below the heading and
                            date.
                        </div>
                    </a>
                    <a href="#" className="list-group-item list-group-item-action py-3 lh-sm">
                        <div className="d-flex w-100 align-items-center justify-content-between">
                            <strong className="mb-1">List group item heading</strong>
                            <small className="text-muted">Mon</small>
                        </div>
                        <div className="col-10 mb-1 small">Some placeholder content in a paragraph below the heading and
                            date.
                        </div>
                    </a>
                    <a href="#" className="list-group-item list-group-item-action py-3 lh-sm" aria-current="true">
                        <div className="d-flex w-100 align-items-center justify-content-between">
                            <strong className="mb-1">List group item heading</strong>
                            <small className="text-muted">Wed</small>
                        </div>
                        <div className="col-10 mb-1 small">Some placeholder content in a paragraph below the heading and
                            date.
                        </div>
                    </a>
                    <a href="#" className="list-group-item list-group-item-action py-3 lh-sm">
                        <div className="d-flex w-100 align-items-center justify-content-between">
                            <strong className="mb-1">List group item heading</strong>
                            <small className="text-muted">Tues</small>
                        </div>
                        <div className="col-10 mb-1 small">Some placeholder content in a paragraph below the heading and
                            date.
                        </div>
                    </a>
                    <a href="#" className="list-group-item list-group-item-action py-3 lh-sm">
                        <div className="d-flex w-100 align-items-center justify-content-between">
                            <strong className="mb-1">List group item heading</strong>
                            <small className="text-muted">Mon</small>
                        </div>
                        <div className="col-10 mb-1 small">Some placeholder content in a paragraph below the heading and
                            date.
                        </div>
                    </a>
                    <a href="#" className="list-group-item list-group-item-action py-3 lh-sm" aria-current="true">
                        <div className="d-flex w-100 align-items-center justify-content-between">
                            <strong className="mb-1">List group item heading</strong>
                            <small className="text-muted">Wed</small>
                        </div>
                        <div className="col-10 mb-1 small">Some placeholder content in a paragraph below the heading and
                            date.
                        </div>
                    </a>
                    <a href="#" className="list-group-item list-group-item-action py-3 lh-sm">
                        <div className="d-flex w-100 align-items-center justify-content-between">
                            <strong className="mb-1">List group item heading</strong>
                            <small className="text-muted">Tues</small>
                        </div>
                        <div className="col-10 mb-1 small">Some placeholder content in a paragraph below the heading and
                            date.
                        </div>
                    </a>
                    <a href="#" className="list-group-item list-group-item-action py-3 lh-sm">
                        <div className="d-flex w-100 align-items-center justify-content-between">
                            <strong className="mb-1">List group item heading</strong>
                            <small className="text-muted">Mon</small>
                        </div>
                        <div className="col-10 mb-1 small">Some placeholder content in a paragraph below the heading and
                            date.
                        </div>
                    </a>
                </div>
            </div>
        </div>
    )
}

export default SideBar
