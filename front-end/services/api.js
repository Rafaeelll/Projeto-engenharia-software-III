import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URI,
    method: ['post', 'put', 'get', 'delete']
})

export default api