import DataService from './data';

const AuthService = {

    // id авторизованного пользователя
    get userId() {
        return localStorage.getItem('userId')
    },

    // авторизация
    login(login, password) {
        return new Promise((resolve, reject) => {
            DataService.login(login, password)
                .then(d => { 
                    localStorage.setItem('userId', d.data.id)
                    resolve(d.data) 
                })
                .catch(error => {
                    reject(error)
                })
        })
    },

    // выход
    logout() {
        localStorage.removeItem('userId')
    },

    // регистрация
    register(login, password) {
        return new Promise((resolve, reject) => {
            DataService.register(login, password)
                .then(d => {       
                    // запоминаю id созданного пользователя                                 
                    localStorage.setItem('userId', d.data.id)
                    resolve(d)
                })
                .catch(error => {
                    reject(error)
                })
        })
    },

    // авторизован ли пользователь
    get isAuthenticated() {                
        return localStorage.getItem('userId') !== null
    }
}

export default AuthService