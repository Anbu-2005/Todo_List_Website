import axios from "axios"
const instance = axios.create({
    baseURL:"https://todo-list-website-ydfm.onrender.com/api"
})
export default instance
