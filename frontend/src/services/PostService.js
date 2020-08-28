import axios from 'axios';

const url = 'http://localhost:3000/api/';

export default {
    createPost(formData) {
        return axios
        .post(url + 'post/', formData)
        .then((response) => response)
        .catch((err) => err)
    },
    
    getAllPost() {
        return axios
        .get(url + 'post/')
        .then((response) => response.data.result);
    },

    likePost(postId) {
        return axios
        .post(url + 'post/' + postId + '/like')
        .then(response => response.data.result)
        .catch((err) => err)
    },

    getLikes() {
        return axios
        .get(url + 'like/')
        .then((response) => response.data)
    },

    deletePost(postId) {
        return axios
        .delete(url + 'post/' + postId)
        .then(response => response.data)
        .catch((err) => err)
    }

  
 

}