import React from "react"
import {Link} from "react-router-dom"

function Login() {
    return (
        <div className="d-flex justify-content-center p-5">
            <div className="card" style={{width: 400}}>
                <div className="card-body">
                    <form>
                        <h1 className="h3 mb-3 fw-normal">Log in</h1>

                        <div className="mb-3">
                            <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                            <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"/>
                            <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                            <input type="password" className="form-control" id="exampleInputPassword1"/>
                        </div>

                        <div className="mb-3 form-check">
                            <input type="checkbox" className="form-check-input" id="exampleCheck1"/>
                            <label className="form-check-label" htmlFor="exampleCheck1">Check me out</label>
                        </div>

                        <button type="submit" className="btn btn-primary w-100">Login</button>
                    </form>

                    <div className="mt-3">
                        Need an account ? <Link to="/register">Create an account</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
