<template>
    <div class="container">
        <section class="message">
            <div class="messageHeader">
                <div class="authorDetails">
                    <img v-if="post.profilePic" class="profilePic" :src="post.profilePic"
                        alt="Photo de profil de l'utilisateur">
                    <img v-if="!post.profilePic" class="profilePic" src="../assets/anonymous.png"
                        alt="Photo de profil par défaut">
                    <div>
                        <h2 href="#">{{post.firstName}} {{post.lastName}} </h2>
                        <em class="postDate">{{format_date(post.date)}}</em>
                    </div>

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
                            <em @click="showDiv(post)" class="comment fas fa-comment-alt"></em>
                        </li>
                        <li>
                            <em @click="likeIt(post)" :class="liked?'fa':''" class="like fas fa-heart"></em>
                        </li>
                        <li class="nbLikes">
                            {{post.likes}} j'aime(s)
                        </li>
                    </ul>
                </div>

                <div v-if="post === chosenExpenseId" class="newComment">
                    <div class="inputBloc">
                        <form>
                            <label for="commentPost">Ecrivez un commentaire pour vos amis</label>
                            <textarea type="text" id="commentPost" v-model="message" />
                            <p v-if="msg"> {{msg}} </p>
                            <button type="button" id="sendComment" @click="newComment(post)">Envoyer</button>
                        </form>

                    </div>

                    <div v-for="(comment, index) in comments" :key="index">
                        <div v-if="comment.postId === post.id" class="comments">
                            <div class="commentAuthorDetails">
                                <img class="commentProfilePic" :src="comment.profilePic" alt="">
                                <div>
                                    <h2 href="#">{{comment.firstName}} {{comment.lastName}}</h2>
                                    <em class="commentDate">{{format_date(comment.date)}} </em>
                                </div>
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

                if(formData.get("message") == "") {
                    this.msg = "Vous ne pouvez pas envoyer de message vide"
                } else {
                    const response = CommentService.commentPost(formData).then(() => {
                    this.msg = response.msg
                })
                post.comments++;
                this.comments = await CommentService.getAllComments();
                this.message = "";
                }

              
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
  display: flex;
  margin: 15px auto;
  justify-content: center;
  align-items: center;
  width: 250px;
  height: 50px;
  border: none;
  cursor: pointer;
  color: #003A4D;
  background: white;
  font-size: 1.5em;
  font-weight: bold;
  transition: .4s ease-in-out;

  &:hover {
    box-shadow: inset #003d75 0px 0px 0px 50px;
    color: white;
  }
}

    .fa:before {
        color: red;
    }

    .container {
        margin: auto;
    }

    .message {
        padding: 50px 25px 0;
        color: white;
        background: white;
        margin: 50px auto 0px;

        .messageHeader {
            padding: 10px 25px;
            display: flex;
            flex-direction: column;
            background: #003A4D;
            width: 400px;
            flex-wrap: wrap;


            .authorDetails {
                display: flex;
                overflow: hidden;

                h2 {
                    text-align: start;
                    font-size: 1.3em;
                    flex: 1;
                    margin: 5px;
                }

                .postDate {
                    margin: 5px;
                    align-self: center;
                }
            }

            img {
                width: 70px;
                height: 60px;
                margin-right: 15px;
                object-fit: cover;
            }
        }

        .messageContent {
            align-content: center;
        }
            .gifPosted {
                margin: 25px auto 0;
                width: 450px;
            }

            .control {
                
                ul {
                    display: flex;
                    list-style: none;
                    justify-content: left;
                    padding: 0;

                    li {
                        font-size: 1.5em;

                        em {
                            color: #003A4D;
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
                    }

                    .nbLikes {
                        color: #003A4D;
                        margin-left: auto;
                        font-size: 1.2em;
                    }
                }
            }

                .newComment {
                    display: flex;
                    flex-direction: column;
                    margin: 5px;
                    color: #003A4D;

        .inputBloc {
            display: flex;
            flex-direction: column;


            form {
                display: flex;
                flex-direction: column;
                width: 100%;
                text-align: center;
                align-items: center;

                label {
                    margin-top: 15px;
                }

                #sendComment {
                @include btn;
                font-size: 1.6em;
                }

                textarea {
                    font-size: 1.2em;
                    margin: auto;
                    max-width: 400px;
                    min-width: 400px;
                    min-height: 50px;
                    max-height: 400px;
                    margin: 20px 10px;
                    font-family: 'Lato', sans-serif;
                }
            }
        }
    }

            .comments {
                padding: 5px 10px;
                margin: 5px auto ;
                display: flex;
                flex-direction: column;
                background: #003A4D;
                color: white;
                flex-wrap: wrap;
                width: 400px;

                .commentAuthorDetails {
                    display: flex;
                    margin: 5px;
                    font-size: 0.8em;

                    .commentProfilePic {
                        width: 20%;
                        height: 50px;
                        margin-right: 15px;
                        align-self: center;
                        object-fit: cover;

                    }

                    h2 {
                        margin: 5px;
                    }

                    .commentDate {
                        font-size: .8em;
                        
                        margin: 5px ;
                        align-self: center;
                    }
                }

                .commentText {
                    margin: 5px;
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
                width: 300px;
                margin-bottom: 10px;

                .authorDetails {
                    font-size: .8em;
                }
            }

            .messageContent {

                width: min-content;
                
                .gifPosted {
                    width: 350px;
                }

                .comments {
                    width: 85%;

                    .commentAuthorDetails {

                        align-items: center;

                        h2 {
                            font-size: 1em;
                        }
                    }

                    .commentText {
                        font-size: .8em;
                    }
                }
            }
        }

        .newComment {
            .inputBloc {
                form {
                    display: flex;
                    flex-direction: column;

                    #commentPost {
                        min-width: 300px;
                        max-width: 300px;
                        margin: 10px auto;
                    }

                    #sendComment {
                        font-size: 1.2em;
                    }

                    
                }
            }
        }
    }
</style>