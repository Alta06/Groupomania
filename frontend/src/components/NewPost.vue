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
                        <textarea v-model="messages" name="messages" id="messages" type="text" />
                        <em class="msg" v-if="msg"> {{msg}} </em>
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
                selectedFile: "",
                msg: ""
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

                    if (!formData.get("file")) {
                        this.msg = "N'oubliez pas d'ajoutez un gif ou une image";

                    } else {
                        
                        const response =  PostService.createPost(formData).then(() => {
                        this.res = response;
                        
                    });

                    setTimeout(() => {
                        this.$router.go();
                    }, 100);
                    }

             

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

$principalClr: #005cb3;

@mixin btn {
  display: flex;
  margin: auto;
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

    #addGif {
        border-radius: 10px;
        background-color: $principalClr;
        margin: auto;
    }

    #sendLabel {
        color: #003a4d;
    }

    .msg {
        color: #003a4d;
        margin: 10px;
        font-weight: bold;
    }

    .message {
        width: 450px;
        padding: 50px 25px;
        color: white;
        background: white;
        margin: auto;
        

        .messageHeader {
            margin: auto;
            padding: 25px;
            display: flex;
            flex-direction: column;
            background: #003a4d;
            width: 300px;
            margin-bottom: 25px;

            label {
                margin: 0 auto 10px;
                font-size: 1.2em;
            }

        }

        .messageContent {
            margin: auto;
            align-content: center;

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
                    font-family: 'Lato', sans-serif;
                    font-size: 1.2em;
                    padding: 15px;
                    height: 80px;
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
            margin: auto;
            width: 350px;
            padding: 20px;
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