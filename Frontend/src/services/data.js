import axios from "axios"

const instance = axios.create({
    baseURL: 'http://localhost:4000'  // backend
});

const DataService = {

    // выполнить регистрацию пользователя
    register(login, password) {
        return instance.post('/user/register', { "login": login, "password": password })      
    },

    // обновить информацию о профиле
    updateProfile(userId, email, password, firstname, lastname) {
        return instance.put('/user/profile', { 
            "userId": userId, 
            "email": email, 
            "password": password, 
            "firstname": firstname, 
            "lastname": lastname })
    },

    // получить авторизационный токен
    login(login, password) {
        return instance.get(`/user/token/${login}/${password}`)
    },

    // получить профиль пользователя
    profile(userid) {
        return instance.get(`/user/profile/${userid}`)
    },

    // получить список доступных упражнений
    exercisesavailable(userid, filter, order) {
        return instance.get(`/exercise/available/${userid}?filter=${filter}&order=${order}`)
    },

    // получить список тренировок
    trainingsavailable(userid, filter, order) {
        return instance.get(`/training/available/${userid}?filter=${filter}&order=${order}`)
    },

    // создать новое упражнение
    exercisecreate(userid, data) {
        return instance.post(`/exercise/`, {...data, user_id: userid})
    },

    // создать новую тренировку
    trainingcreate(userid, data) {
        return instance.post(`/training/`, {...data, user_id: userid})
    },

    // обновить существующее упражнение
    exerciseupdate(userid, id, data) {
        return instance.put(`/exercise/${id}`, {...data, user_id: userid})
    },

    // обновить существующую тренировку
    trainingupdate(userid, id, data) {
        return instance.put(`/training/${id}`, {...data, user_id: userid})
    },

    // получить упражнение по id
    exercise(id) {
        return instance.get(`/exercise/${id}`)
    },

    // получить список записей в словаре
    dictionary(typeid) {
        return instance.get(`/dictionary/${typeid}`)
    },

    // удалить упражнение по id
    exercisedelete(id) {
        return instance.delete(`/exercise/${id}`)
    },

    // удалить тренировку по id
    trainingdelete(id) {
        return instance.delete(`/training/${id}`)
    }
}

export default DataService