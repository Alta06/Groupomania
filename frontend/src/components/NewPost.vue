<template>
    <div class="container">
        <section class="message">
            <form enctype="multipart/form-data">
                <div class="messageHeader">
                    <label for="addGif" name="addGif">Partagez un gif avec vos collègues</label>
                    <input type="file" @change="onFileChange" id="addGif" name="addGif" />
                </div>

                <div class="messageContent">
                    <div class="control">
                        <label for="messages" id="sendLabel" name="messages">Ajoutez-y un message</label>
                        <textarea v-model="messages" name="messages" id="messages" type="text"/>
                        <button @click="post" type="button" id="send">Envoyer</button>
                    </div>
                </div>
            </form>
        </section>
    </div>
</template>

<script>
    import PostService from "../services/PostService";

    export default {
        name: "NewPost",
        data() {
            return {
                messages: "",
                selectedFile: ""
            };
        },

        methods: {
            onFileChange(e) {
                const selectedFile = e.target.files[0]; // accessing file
                this.selectedFile = selectedFile;
            },
            post() {
                try {
                    const formData = new FormData();
                    formData.append("file", this.selectedFile);
                    formData.append("messages", this.messages);

                    const response =  PostService.createPost(formData).then(() => {
                        this.msg = response;
                        
                    });

                    setTimeout(() => {
                        this.$router.go()
                    }, 100);

                } catch (error) {
                    this.msg = error.response.data.msg;
                }

            },
        },

        computed: {},
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

 @mixin btn {
        height: 50px;
        width: 80px;
        align-self: center;
        margin: auto 0;
        background-color: #1fc567;
        color: white;
        border: none;
        border-radius: 5px;
        transition: .4s;
        cursor: pointer;
        font-size: 2em;
        font-weight: bold;

        &:hover {
            background-color: #14753e;
        }
    }

    #addGif {
        border-radius: 10px;
        background-color: #1fc567;
        margin: auto;
    }

    #sendLabel {
        color: #003a4d;
    }

    .message {
        padding: 50px 25px;
        color: white;
        border-radius: 40px;
        background: white;
        margin: auto;
        

        .messageHeader {
            padding: 10px 25px;
            display: flex;
            flex-direction: column;
            background: #003a4d;
            border-radius: 25px;
            width: 300px;
            margin-bottom: 25px;

            label {
                margin: 10px auto;
                font-size: 1.2em;
            }

        }

        .messageContent {
            margin: auto;
            align-content: center;

            p {
                margin: 50px;
            }

            img {
                margin: 25px auto 0;
                width: 450px;
                border-radius: 15px;
                border: 10px #003a4d solid;
            }

            .control {
                border-radius: 15px;
                width: 350px;
                margin: auto;
                display: flex;
                flex-direction: column;

                #send {
                    @include btn;
                    margin-top: 20px;
                    width: 250px;

                }

                textarea {
                    padding: 15px;
                    height: 80px;
                    border-radius: 10px;
                    border: 2px solid #003a4d;
                    height: 60%;

                   
                }
            }
        }
    }

    @media all and (max-width: 425px) {

            .container {
                width: 100%;
                margin-top: 10px;
            }

        .message {
            padding: 10px;
            right: 0;
            position: relative;

            .messageHeader {
                width: 300px;
                margin-bottom: 10px;
            }

            .messageContent {
                img {
                    margin: 0;
                    width: 300px;
                }

                .control {
                    width: 250px;

                    input {
                        height: 20px;
                    }

                    #send {
                        height: 40px;
                    }
                }
            }
        }
    }
</style>