import axios from 'axios'

var local = 'http://10.0.2.2:3000/api'

export default axios.create({
    baseURL: `${local}`
})