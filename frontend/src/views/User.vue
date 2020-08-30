<template>
  <div class="User">
    <Sidebar />
    <Header />
    <div v-if="token" class="container">

      <h2>Votre profil</h2>

      <div v-if="isHidden">

      <form enctype="multipart/form-data" class="details" v-for="detail in member" :key="detail.firstName" >

        <img v-if="detail.profilePic" class="profilePic" :src="detail.profilePic" alt="Photo de profil de l'utilisateur" />
        <img v-if="!detail.profilePic" class="profilePic" src="../assets/anonymous.png" alt="Photo de profil par défaut" />

        <input type="file" @change="onFileChange" id="addPic" name="addPic"
          accept="image/jpg, image/png, image/jpeg" />

          <h3 v-if="isHidden">Remplissez les champs que vous souhaitez modifiez</h3>

        <div class="group">
          <input v-model="firstName" type="text" name="firstName" id="firstName"  />
          <label for="firstName">Prénom : {{detail.firstName}}</label>
        </div>

        <div class="group">
          <input v-model="lastName" type="text" name="lastName" id="lastName"/>
          <label for="lastName">Nom : {{detail.lastName}}</label>
        </div>

        <div class="group">
          <input v-model="birthday" type="date" name="birthday" id="birthday" />
          <label for="birthday">Date de naissance : {{format_date(detail.birthday)}}</label>
        </div>

        <div class="group">
          <input v-model="employement" type="text" name="employement" id="employement"/>
          <label for="employement">Poste : {{detail.employement}}</label>
        </div>

        <div class="group">
          <input v-model="inCompanySince" type="date" name="inCompanySince" id="inCompanySince" />
          <label for="inCompanySince">Date d'entrée dans l'entreprise : {{format_date(detail.inCompanySince)}}</label>
        </div>

        <div class="group">
          <input v-model="email" type="text" name="email" id="email"/>
          <label for="email">Adresse email : {{detail.email}}</label>
        </div>

                  <p v-if="errorMsg"> {{errorMsg}} </p>
                  <p v-if="successMsg"> {{successMsg}} </p>



        <div v-if="detail.isAdmin" :style="{'color':'red'}">
          <p>Cet utilisateur est administrateur</p>
        </div>
      </form>

</div>
      <a class="btn" @click="isHidden = !isHidden" href="#">Gérer le compte</a>
      <a v-if="isHidden" class="btn" @click="edit" href="#">Confirmer les changements</a>
      <a v-if="isHidden" class="btn btn-red" @click="deleteUser" href="#">Supprimer le compte</a>

    </div>
    <Footer />
  </div>
</template>

<script>
  // @ is an alias to /src
  import Sidebar from "../components/Sidebar";
  import Header from "../components/Header";
  import Footer from "../components/Footer";
  import AuthService from "../services/AuthService";
  import moment from "moment";

  export default {
    name: "Home",
    components: {
      Sidebar,
      Header,
      Footer,
    },
    data() {
      return {
        member: {},
        isHidden: false,
        token: this.$store.getters.isLoggedIn,
        selectedFile: "",
        firstName: "",
        lastName: "",
        birthday: "",
        email: "",
        password: "",
        inCompanySince: "",
        employement: "",
        successMsg: "",
        errorMsg: ""
      };
    },
    async created() {
      this.member = await AuthService.getInfo();
    },

    methods: {
      async edit() {
        try {
          const formData = new FormData();
          formData.append("file", this.selectedFile);
          formData.append("firstName", this.firstName);
          formData.append("lastName", this.lastName);
          formData.append("birthday", this.birthday);
          formData.append("email", (this.email).toLowerCase());
          formData.append("inCompanySince", this.inCompanySince);
          formData.append("employement", this.employement);

          const response = await AuthService.updateUser(formData)
          this.successMsg = response;

        } catch (error) {
          this.errorMsg = error;
        }
      },
      onFileChange(e) {
        const selectedFile = e.target.files[0]; // accessing file
        this.selectedFile = selectedFile;
      },

      format_date(value) {
        if (value) {
          return moment(String(value)).format("DD/MM/YYYY");
        }
      },

      deleteUser() {
        let r = confirm("Êtes-vous sûr de vouloir supprimer votre compte ainsi que toutes vos données ?")
        if (r == true) {
          try {
            const response = AuthService.deleteUser().then(() => {
              this.msg = response.msg;
              this.$store.dispatch('logout');
              this.$router.go();
            })

          } catch (error) {
            this.msg = error.response.data.msg;
          }
        }
      },
    },
  };
</script>

<style scoped lang="scss">
  /* form starting stylings ------------------------------- */

  .details {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .group {
    position: relative;
    margin-bottom: 45px;

    input {
      font-size: 18px;
      padding: 10px 10px 10px 5px;
      width: 300px;
      border: none;
      border-bottom: 1px solid #ffffff;
      background: #01698b;
      color: white;
    }

    input:focus {
      outline: none;
    }

    /* LABEL ======================================= */
    label {
      color: rgb(255, 255, 255);
      font-size: 18px;
      font-weight: normal;
      position: absolute;
      pointer-events: none;
      left: 5px;
      top: 10px;
      transition: 0.2s ease all;
    }

    /* active state */
    input:focus~label,
    input:valid~label {
      top: -20px;
      font-size: 14px;
      color: #ffffff;
    }

  }



  .container {
    display: flex;
    flex-direction: column;
    color: #fff;

    .btn {
      text-align: center;
      display: flex;
      justify-content: center;
      align-items: center;
      text-decoration: none;
      height: 50px;
      color: white;
      background: #1fc567;
      border-radius: 5px;
      font-size: 1.6em;
      font-weight: bolder;
      margin: 8px auto;
      width: 320px;

      &:hover {
        background-color: #14753e;
      }

      &-red {
        background-color: red;

        &:hover {
          background-color: rgb(121, 1, 1);
        }
      }
    }

    .profilePic {
      margin: 0 auto;
      width: 200px;
      border-radius: 15px;
    }

    h2, h3 {
      text-align: center;
    }

    h3 {
      padding-bottom: 50px;

    }

    #addPic {
      margin: 10px auto 30px;
      background-color: #1fc567;
      border-radius: 10px;
    }

  }

  .errorMsg {
    font-size: 1em;
    text-align: center;
    background: red;
    width: 50%;
    border-radius: 15px;
    margin: 10px auto;
    padding: 5px;
  }

  @media all and (max-width: 768px) {
    .container {
      margin: auto;
      width: 80%;
    }

  }

  @media all and (max-width: 425px) {
    .container {
      width: 100%;
    }
  }
</style>