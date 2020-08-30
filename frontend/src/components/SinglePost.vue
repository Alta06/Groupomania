<template>
    <div class="container">
        <section class="message">
            <div class="messageHeader">
                <div class="authorDetails">
                    <img v-if="post.profilePic" class="profilePic" :src="post.profilePic"
                        alt="Photo de profil de l'utilisateur">
                    <img v-if="!post.profilePic" class="profilePic" src="../assets/anonymous.png"
                        alt="Photo de profil par défaut">
                    <h2 href="#">{{post.firstName}} {{post.lastName}} </h2>
                    <p class="postDate">{{format_date(post.date)}}</p>
                    <em v-if="isPostAuthor(post)" @click="deletePost(post)"
                        class="far fa-times-circle deleteComment"></em>

                </div>

                <p class="messageText"> {{post.messages}} </p>
            </div>

            <div class="messageContent">

                <img class="gifPosted" :src="post.url" alt="Gif envoyé par l'utilisateur">
                <div class="control">
                    <ul>
                        <li>
                            <em @click="showDiv(post)" class="comment far fa-comment-alt">{{post.comments}}</em>
                        </li>
                        <li>
                            <em @click="likeIt(post)" :class="liked?'fa':''"
                                class="like far fa-heart">{{post.likes}}</em>
                        </li>
                    </ul>
                </div>

                <div v-if="post === chosenExpenseId" class="newComment">
                    <div class="inputBloc">
                        <form>
                            <label for="commentPost">Ecrivez un commentaire pour vos amis</label>
                            <textarea type="text" id="commentPost" v-model="message" />
                            <button type="button" @click="newComment(post)">Envoyer</button>
                        </form>

                    </div>

                    <div v-for="(comment, index) in comments" :key="index">
                        <div v-if="comment.postId === post.id" class="comments">
                            <div class="commentAuthorDetails">
                                <img class="commentProfilePic" :src="comment.profilePic" alt="">
                                <h2 href="#">{{comment.firstName}} {{comment.lastName}}</h2>
                                <em v-if="isCommentAuthor(comment)" @click="deleteComment(comment)"
                                    class="far fa-times-circle deleteComment"></em>

                            </div>
                            <p class="commentText"> {{comment.message}} </p>
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
            this.posts = await PostService.getAllPost();
            this.comments = await CommentService.getAllComments();

        },

         async mounted() {
            this.likes = await PostService.getLikes();
            this.isLiked();
        },

        computed: {
            
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
                let likeResult = this.likes.result;
                let postResult = this.post;

                for (let r of likeResult) {
                    if (r.postLiked === postResult.id) {
                        this.liked = true;
                    } 
                }                
            },

            likeIt(post) {
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
    @mixin btn {
        transition: .4s;
        height: 50px;
        width: 180px;
        align-self: center;
        margin: 10px;
        background-color: #1fc567;
        color: white;
        border: none;
        border-radius: 5px;
        transition: .4s;
        cursor: pointer;

        &:hover {
            background-color: #14753e;
        }
    }

    .fa:before {
        color: red;
    }

    .container {
        margin: 50px auto;
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


            .authorDetails {
                display: flex;

                h2 {
                    text-align: start;
                    font-size: 1.3em;
                    flex: 1;
                }

                .postDate {
                    margin: 10px;
                    align-self: center;
                }
            }

            .messageText {
                margin: 15px;
            }

            img {
                width: 70px;
                height: 50px;
                border-radius: 25px;
                margin-right: 15px;
                align-self: center;
            }
        }

        .messageContent {
            align-content: center;
        }
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

                        em {
                            padding: 5px;
                            color: white;
                            cursor: pointer;

                            &:before {
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
            flex-direction: column;

            form {
                display: flex;
                flex-direction: column;
                width: 100%;
                text-align: center;

                label {
                    margin-top: 15px;
                }

                button {
                @include btn;
                font-size: 1em;
                }

                textarea {
                height: 50px;
                margin: 20px 10px;
                }
            }
        }

    }

            .comments {
                padding: 0 10px 20px;
                margin: 5px auto ;
                display: flex;
                flex-direction: column;
                background: #41636e;
                border-radius: 25px;
                flex-wrap: wrap;
                width: 400px;

                .commentAuthorDetails {
                    display: flex;
                    margin: 5px;

                    .commentProfilePic {
                        width: 70px;
                        border-radius: 25px;
                        margin-right: 15px;
                        align-self: center;
                    }
                }

                .commentPost {
                    margin: 0 15px;
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

    @media all and (max-width: 425px) {

        .container {
            margin-top: 20px;
        }

        .message {
            padding: 20px;
            margin: 20px auto;

            .messageHeader {
                margin-bottom: 10px;

                .authorDetails {
                    font-size: .8em;
                }
            }

            .messageContent {
                
                .gifPosted {
                    width: 350px;
                }

                .control {
                    width: 300px;
                }

                .comments {
                    width: 85%;

                    .commentText {
                        margin-bottom: 10px;
                    }
                }
            }
        }

        .newComment {
            .inputBloc {
                form {
                    display: flex;
                    flex-direction: column;

                    textarea {
                        width: 90%;
                    }
                }
            }
        }
    }
</style>