import axios from 'axios';

const url = 'http://localhost:3000/api/';

export default {

commentPost(formData) {
        return axios
        .post(url + 'comment/', formData)
        .then(response => response.data)
        .catch((err) => err)
    },

getAllComments() {
    return axios
    .get(url + 'comment/')
    .then(response => response.data.result)
    .catch((err) => err)

},

deleteComment(commentId, postId) {
    return axios
    .delete(url + 'comment/' + commentId + '/' + postId)
    .then((response) => response.data)
    .catch((err) => err)

}

}