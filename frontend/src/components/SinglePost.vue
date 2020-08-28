<template>
    <div class="container" >
        <section class="message">
            <div class="messageHeader">
                <div class="authorDetails">
                    <img class="" :src="post.profilePic" alt="Photo de profil de l'utilisateur">
                    <h2 href="#">{{post.firstName}} {{post.lastName}} </h2>
                    <p class="postDate">- {{format_date(post.date)}}</p>
                    <i v-if="isPostAuthor(post)" @click="deletePost(post)" class="far fa-times-circle deleteComment"></i>

                </div>

                <p class="messageText"> {{post.messages}} </p>
            </div>

            <div class="messageContent">

                <img class="gifPosted" :src="post.url" alt="Gif envoyé par l'utilisateur">
                <div class="control">
                    <ul>
                        <li>
                            <i @click="showDiv(post)" class="comment far fa-comment-alt">{{post.comments}}</i>
                        </li>
                        <li>
                            <i @click="like(post)" :class="{ fa: liked}"
                             class="like far fa-heart">{{post.likes}}</i>
                        </li>
                    </ul>
                </div>

                <div v-if="post === chosenExpenseId" class="newComment">
                    <p class="commentMessage">Ecrivez un commentaire pour vos amis !</p>
                    <div class="inputBloc">
                        <form>
                            <input type="text" v-model="message">
                            <button type="button" @click="newComment(post)">Envoyer</button>
                        </form>

                    </div>

                    <div v-for="(comment, index) in comments" :key="index">
                        <div v-if="comment.postId === post.id" class="comments">
                            <div class="authorDetails">
                                <img class="commentProfilePic" :src="comment.profilePic" alt="">
                                <h2 href="#">{{comment.firstName}} {{comment.lastName}}</h2>
                                <i v-if="isCommentAuthor(comment)" @click="deleteComment(comment)"
                                    class="far fa-times-circle deleteComment"></i>

                            </div>
                            <p class="messageText"> {{comment.message}} </p>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    </div>
</template>

<script>
    import PostService from '../services/PostService';
    import CommentService from '../services/CommentService';
    import moment from "moment";


    export default {
        name: 'SinglePost',

        data() {
            return {
                
                comments: {

                },
                likes: {

                },
                message: "",
                liked: null,
                isHidden: false,
                expenseButton: [],
                chosenExpenseId: null,
                msg: ''
            }
        },

        props: ['post'],
        
        async created() {
            this.comments = await CommentService.getAllComments();
            this.likes = await PostService.getLikes();
        },

        mounted(post) {
            this.isLiked(post)
        },

        methods: {

            showDiv(post) {
                this.chosenExpenseId = this.chosenExpenseId !== post ? post : null;
            },

            isCommentAuthor(comment) {
                if (this.$store.getters.getUser === comment.userId) {
                    return true;
                }
                return false;
            },

            isPostAuthor(post) {
                if (this.$store.getters.getUser === post.userId) {
                    return true
                } 
            },

            isLiked() {
                const response = PostService.getLikes().then(() => {
                    this.msg = response;
                })

      
            },

            like(post) {
                try {
                    const postId = post.id;
                    const response = PostService.likePost(postId).then(() => {
                        this.msg = response.msg;
                    });

                } catch (error) {
                    this.msg = error.response.data.msg
                }
                
                this.liked = !this.liked;

                if (this.liked) {
                    post.likes++;
                } else if (!this.liked) {
                    post.likes--;
                }
            },
        
            async newComment(post) {
                const formData = new FormData();
                const postId = post.id;

                formData.append("message", this.message);
                formData.append("postId", postId);

                const response = CommentService.commentPost(formData).then(() => {
                    this.msg = response.msg
                })
                post.comments++;
                this.comments = await CommentService.getAllComments();
                this.message = "";
            },

            async deleteComment(comment, index) {

                const commentId = comment.id;
                const postId = comment.postId;
                const response = CommentService.deleteComment(commentId, postId).then(() => {
                    this.msg = response.msg;
                })
                
                    if (comment.postId === this.post.id) {
                        this.comments.splice(comment, index);
                        this.post.comments--;
                    }
                    this.comments = await CommentService.getAllComments();

            },

            deletePost(post) {
                const postId = post.id;
                const response = PostService.deletePost(postId).then(() => {
                    this.msg = response.msg;
                })

                this.$emit('delete-post', post);

            },

            format_date(value) {
                if (value) {
                    return moment(value).fromNow();
                }
            }

        },


    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.fa:before { 
    color: red;
}
    .container {
        margin: 50px auto 50px;
        display: flex;
        flex-direction: column;
    }

    .newComment {
        background-color: #003A4D;
        border-radius: 15px;
        display: flex;
        flex-direction: column;
        margin: 5px;

        .commentMessage {
            margin: 10px;
        }

        .inputBloc {
            display: flex;

            form {
                width: 100%;

            }

            button {
                height: 50px;
                width: 80px;
                align-self: center;
                margin: auto 0;
                background-color: #1fc567;
                color: white;
                border: none;
                border-radius: 5px;
                transition: .4s;

                &:hover {
                    background-color: #14753e;
                }
            }

            input {
                height: 50px;
                width: 70%;
                margin: 20px 10px;
            }
        }

    }

    .message {
        padding: 50px 25px 0;
        color: white;
        border-radius: 40px;
        background: white;
        margin: 50px auto;

        .messageHeader {
            padding: 10px 25px;
            display: flex;
            flex-direction: column;
            background: #003A4D;
            border-radius: 25px;
            flex-wrap: wrap;
            width: 400px;

            .authorDetails {
                display: flex;

                h2 {
                    text-align: start;
                    font-size: 1.3em;
                }

                .postDate {
                    margin: 10px;
                    align-self: center;
                }
            }



            .messageText {
                margin: 0 0 15px 5px;
            }

            img {
                width: 70px;
                border-radius: 25px;
                margin-right: 15px;
                align-self: center;
            }
        }

        .messageContent {
            align-content: center;

            .gifPosted {
                margin: 25px auto 0;
                width: 450px;
                border-radius: 15px;
                border: 10px #003A4D solid;
            }

            .control {
                background: #003A4D;
                border-radius: 15px;
                width: 200px;
                margin: auto;


                ul {
                    display: flex;
                    list-style: none;
                    justify-content: center;
                    padding: 0;

                    li {
                        font-size: 1.5em;
                        padding: 8px 20px;

                        i {
                            padding: 5px;
                            color: white;
                            cursor: pointer;

                            &::before {
                                margin-right: 10px;
                                transition: .5s;

                            }
                        }

                        .comment:hover::before {
                            color: grey;
                        }

                        .like:hover::before {

                            color: red;
                        }

                        .isActive::before {
                            color: red;
                        }


                    }
                }
            }

            .comments {
                padding: 0 10px 20px;
                margin: 10px;
                display: flex;
                flex-direction: column;
                background: #41636e;
                border-radius: 25px;
                flex-wrap: wrap;
                width: 400px;

                .authorDetails {
                    display: flex;

                    .commentProfilePic {
                        width: 70px;
                        border-radius: 25px;
                        margin-right: 15px;
                        align-self: center;
                    }


                }

                .messageText {
                    margin: 0;
                }
            }
        }
    }

    .deleteComment {
        margin-left: auto;
        cursor: pointer;
        align-self: center;

        &:hover {
            color: red;
        }
    }

    .newMessage {
        display: flex;
        flex-direction: column;
        align-self: center;
        justify-content: center;
        min-height: 50px;
        margin: 5%;
        position: fixed;
        right: 0;
        top: 50%;

        div {
            background: white;
            border-radius: 10px;
            box-shadow: -3px -3px 6px;
            font-size: 16px;
            font-weight: bold;
            min-height: 100px;
            text-align: center;

            .sendMessage {
                width: 100%;
                border-radius: 10px 10px 0 0;
                border: none;
                border-bottom: 2px solid black;
                min-height: 80px;
                outline: none;
                background: white;
            }
        }
    }

    @media all and (max-width: 425px) {

        .message {
            padding: 35px;
            margin: 20px auto;

            .messageHeader {
                width: 85%;
                margin-bottom: 10px;
            }

            .messageContent {
                .gifPosted {
                    margin: 0;
                    width: 95%;
                }

                .control {
                    width: 350px;
                }

                .comments {
                    width: 85%;

                    .messageText {
                        margin-bottom: 10px;
                    }
                }
            }

        }

    }
</style>