import axios from "axios"

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL
})

export function postToken(email, password) {
    return api.post("/api/login", {
        email: email,
        password: password
    })
}

export default api
