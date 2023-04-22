import axios from "axios"

const instance = axios.create({
    baseURL: 'http://localhost:4000'  // backend
});

const DataService = {
    register(login, password) {
        return instance.post('/user/register', { "login": login, "password": password })      
    },

    updateProfile(userId, email, password, firstname, lastname) {
        return instance.put('/user/profile', { 
            "userId": userId, 
            "email": email, 
            "password": password, 
            "firstname": firstname, 
            "lastname": lastname })
    },

    login(login, password) {
        return instance.get(`/user/token/${login}/${password}`)
    },

    profile(userid) {
        return instance.get(`/user/profile/${userid}`)
    }
}

export default DataService