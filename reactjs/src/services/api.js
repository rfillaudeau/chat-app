import axios from "axios"

const api = axios.create({
    baseURL: "http://localhost:8080/api"
})

export function postToken(email, password) {
    return api.post("/api/login", {
        email: email,
        password: password
    })
}

export default api
