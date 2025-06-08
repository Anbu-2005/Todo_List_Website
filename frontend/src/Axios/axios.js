import axios from "axios"
const instance = axios.create({
    baseURL:"https://todo-list-website-backend-28iq.onrender.com"
})
export default instance
