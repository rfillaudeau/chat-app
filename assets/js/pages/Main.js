import React from "react"
import SideBar from "../components/SideBar"

function Main() {
    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-3 p-0 bg-dark text-light">
                    <SideBar />
                </div>
                <div className="col-9 p-0">
                    <div className="p-3 text-bg-dark d-flex align-items-center">
                        <div className="flex-fill">
                            <div className="h5 mb-0">Room title</div>
                        </div>
                        <div className="">
                            Actions
                        </div>
                    </div>

                    <div className="bg-light pt-3">
                        <div className="d-flex px-3 pb-3">
                            <div className="me-3">
                                <img src="https://picsum.photos/id/230/200" className="rounded avatar-sm" alt="..." />
                            </div>
                            <div className="flex-fill">
                                <div className="d-flex align-items-baseline mb-2">
                                    <div className="fw-bold me-3">Username</div>
                                    <div className="text-muted small">2:15 PM</div>
                                </div>
                                <p className="mb-0">
                                    Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?
                                </p>
                            </div>
                        </div>

                        {messageElements}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Main
