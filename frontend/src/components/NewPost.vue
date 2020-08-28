<template>
    <div class="container">
        <section class="message">
            <form enctype="multipart/form-data">
                <div class="messageHeader">
                    <h2>Partagez un gif avec vos collègues</h2>
                    <input type="file" @change="onFileChange" id="addGif" name="addGif" />
                </div>

                <div class="messageContent">
                    <div class="control">

                        <input v-model="messages" name="messages" type="text" placeholder="Tapez ici votre message" />
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
    .container {
        margin: 50px auto 50px;
        display: flex;
    }

    #addGif {
        border-radius: 10px;
        background-color: #1fc567;
        margin: auto;
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

            h2 {
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
                    margin: auto;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    text-decoration: none;
                    height: 50px;
                    color: white;
                    background: #1fc567;
                    border-radius: 5px;
                    font-size: 2em;
                    font-weight: bolder;
                    margin-top: 25px;
                    width: 240px;
                    border: none;
                    cursor: pointer;
                    transition: .4s;


                    &:hover {
                        background-color: #158545;
                    }

                }

                input {
                    height: 80px;
                }
            }
        }
    }

    @media all and (max-width: 425px) {
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