<template>
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
                            class="btn btn-deleteComment">Supprimer</button>
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
        <hr>
    </section>

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

$btnTextClr: #003A4D;

    @mixin btn {
        display: flex;
        margin: 15px auto;
        justify-content: center;
        align-items: center;
        width: 250px;
        height: 50px;
        border: none;
        cursor: pointer;
        color: $btnTextClr;
        background: white;
        font-size: 1.3em;
        font-weight: bold;
        transition: .4s ease-in-out;

        &:hover {
            box-shadow: inset $btnTextClr 0px 0px 0px 50px;
            color: white;
        }
    }

    .singlePost {
        color: white;
        padding: 10px;
        margin-top: 50px;
    }

    .author {
        display: flex;
        justify-content: space-between;

        .profilePic {
            width: 70px;
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
            margin: 20px;
        }

        .gifPosted {
            width: 200px;
        }

        .allComments {
            display: flex;
            flex-direction: column;
            height: 250px;
            width: 50%;
            overflow: scroll;
            margin: 20px;
        }

        .comment {
            padding-top: 5px;
            display: flex;
            flex-direction: column;
            margin: 5px;
            background: #41636e;
        }

        .commentAuthor {
            margin: 5px;
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

        &-delete,
        &-deleteComment {
            width: 98%;
            height: 40px;

            &:hover {
                box-shadow: inset red 0px 0px 0px 50px;

            }
        }
    }

    @media all and (max-width: 1024px) {
        .btn {
            width: 180px;

            &-delete,
        &-deleteComment {
            width: 98%;
            height: 40px;

        }
        }
    }



    @media all and (max-width: 425px) {
        .postContent {
            display: flex;
            flex-direction: column;
            margin: auto;

            .allComments {
                display: flex;
                flex-direction: column;
                width: 90%;
            }

            .messageContent {
                width: 90%;
                text-align: start;
            }
        }

         .btn {
             font-size: 1em;
            width: 112px;

            &-delete,
        &-deleteComment {
            width: 98%;
            height: 40px;

        }
        }
    }
</style>