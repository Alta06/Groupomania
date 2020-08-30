import axios from 'axios';

const url = 'http://localhost:3000/api/';

export default {

    login(credentials) {
        return axios
            .post(url + 'login/', credentials)
            .then(response => response.data)
            .catch((error) => error.response.message)
    },

    signup(credentials) {
        return axios
            .post(url + 'signup/', credentials)
            .then(response => response.data.message )
            .catch((error) => error.data.message)
    },

    getInfo() {
        return axios
            .get(url + 'user/')
            .then(response =>response.data.user)
            .catch((error) => error)
    },

    updateUser(formData) {
        return axios
            .put(url + 'user/', formData)
            .then(response => response.data.message)
            .catch((error) => error.response.message)
    },

    deleteUser() {
        return axios
        .delete(url + 'user/')
        .then(res => res.data)
        .catch((err) => err)
    }

    

}