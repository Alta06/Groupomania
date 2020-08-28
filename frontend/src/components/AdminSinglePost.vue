<template>
    <div class="container">
        <section class="singlePost">

            <div class="author">

                <h2 class="authorName">{{post.firstName}} {{post.lastName}}</h2>
                <p class="postdate">{{format_date(post.date)}}</p>
            </div>
            <div class="postContent">
                <div class="messageContent">
                    <p class="messageText"> {{post.messages}} </p>
                    <img v-if="seeGif" class="gifPosted" :src="post.url" alt="Gif envoyé par l'utilisateur">
                </div>

                <div class="allComments" v-if="seeComments">
                    <div v-for="(comment, index) in comments" :key="index">
                        <div class="comment" v-if="comment.postId === post.id">
                            <h3 class="commentAuthor"> {{comment.firstName}} {{comment.lastName}} </h3>
                            <p class="commentMessage"> {{comment.message}} </p>
                            <button v-if="edit" @click="deleteComment(comment)"
                                class="btn btn-delete">Supprimer</button>
                        </div>

                    </div>
                </div>
            </div>


            <div class="adminController">
                <button class="btn btn-seeGif" @click="seeGif = !seeGif">Voir le gif</button>
                <button class="btn btn-edit" @click="edit = !edit">Modérer</button>
                <button class="btn btn-seeComment" @click="seeComments = !seeComments">Voir les commentaires</button>

            </div>
            <button v-if="edit" class="btn btn-delete" @click="deletePost(post)">Supprimer le post</button>

            <!-- <div class="messageHeader">
                <div class="authorDetails">
                    <img class="" :src="post.profilePic" alt="Photo de profil de l'utilisateur">
                    <h2 href="#">{{post.firstName}} {{post.lastName}} </h2>
                    <p class="postDate">- {{format_date(post.date)}}</p>
                    <i  @click="deletePost(post)" class="far fa-times-circle deleteComment"></i>
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

                <div v-if=" chosenExpenseId" class="newComment">
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
                                <i @click="deleteComment(comment)"
                                    class="far fa-times-circle deleteComment"></i>

                            </div>
                            <p class="messageText"> {{comment.message}} </p>
                        </div>
                    </div>

                </div>
            </div> -->
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
                seeGif: false,
                seeComments: false,
                edit: false,
                chosenExpenseId: null,
                msg: ''
            }
        },

        props: ['post'],

        async created() {
            this.comments = await CommentService.getAllComments();
            this.likes = await PostService.getLikes();
        },

        methods: {

            showDiv() {
                this.chosenExpenseId = !this.chosenExpenseId;
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
    @mixin btn {
        border-radius: 5px;
        border: none;
        width: 115px;
        font-size: 0.9em;
        font-weight: bold;
        color: white;
    }

    .singlePost {
        color: white;
        padding: 10px;
    }

    .author {
        display: flex;
        justify-content: space-between;

        .profilePic {
            width: 70px;
            border-radius: 15px;
        }

        .authorName {
            font-size: 1em;
            align-self: center;
        }


    }

    .postContent {
        display: flex;
        justify-content: space-between;
        margin: auto;

        .messageContent {
            width: 50%;
            text-align: center;
        }

        .gifPosted {
            width: 200px;
            border-radius: 10px;
        }

        .allComments {
            display: flex;
            flex-direction: column;
        }

        .comment {
            border-radius: 10px;
            padding: 5px;
            display: flex;
            flex-direction: column;
            margin-bottom: 5px;
            background: #41636e;
        }

        .commentAuthor {
            margin: 0;

        }

        .commentMessage {
            margin: 5px;
        }
    }

    .adminController {
        display: flex;
        justify-content: space-between;
        margin: 20px;
    }

    .btn {
        @include btn;

        &-delete {
            margin: auto;
            background: red;
            width: 100%;
        }

        &-seeGif,
        &-seeComment {
            background: #1fc567;
        }

        &-edit {
            background: rgb(23, 162, 255);
        }

    }

    @media all and (min-width: 768px) {
        @mixin btn {
            width: 150px;
            font-size: 1.2em;
            cursor: pointer;
        }

            .postContent {
        display: flex;
        justify-content: space-between;
        margin: auto;

        .messageContent {
            width: 50%;
            text-align: start;
        }

        .gifPosted {
            width: 350px;
            border-radius: 10px;
        }

        .allComments {
            display: flex;
            flex-direction: column;
        }

        .comment {
            border-radius: 10px;
            padding: 5px;
            display: flex;
            flex-direction: column;
            margin-bottom: 5px;
            background: #41636e;
        }

        .commentAuthor {
            margin: 0;

        }

        .commentMessage {
            margin: 5px;
        }
    }
        .btn {
            @include btn;

            &-delete {
                margin: auto;
                background: red;
                width: 100%;
                height: 40px;
            }

           

        }
    }

    @media all and (width: 768px) {
             .postContent {
        display: flex;
        justify-content: space-between;
        margin: auto;

        .messageContent {
            width: 50%;
            text-align: start;
        }

        .gifPosted {
            width: 250px;
            border-radius: 10px;
        }

        .allComments {
            display: flex;
            flex-direction: column;
        }

        .comment {
            border-radius: 10px;
            padding: 5px;
            display: flex;
            flex-direction: column;
            margin-bottom: 5px;
            background: #41636e;
        }

        .commentAuthor {
            margin: 0;

        }

        .commentMessage {
            margin: 5px;
        }
    }
    }
</style>