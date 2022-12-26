import React from "react"
import {Link} from "react-router-dom"

function Register() {
    return (
        <div className="d-flex justify-content-center p-5">
            <div className="card" style={{width: 400}}>
                <div className="card-body">
                    <form>
                        <h1 className="h3 mb-3 fw-normal">New account</h1>

                        <div className="mb-3">
                            <label htmlFor="inputUsername" className="form-label">Username</label>
                            <input type="text" className="form-control" id="inputUsername" aria-describedby="usernameHelp"/>
                            <div id="usernameHelp" className="form-text">We'll never share your email with anyone else.</div>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                            <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"/>
                            <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                            <input type="password" className="form-control" id="exampleInputPassword1"/>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="inputConfirmPassword" className="form-label">Confirm password</label>
                            <input type="password" className="form-control" id="inputConfirmPassword"/>
                        </div>

                        <button type="submit" className="btn btn-primary w-100">Create account</button>
                    </form>

                    <div className="mt-3">
                        Already have an account ? <Link to="/login">Login</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register
