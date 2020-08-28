<template>
  <div class="User">
    <Sidebar />
    <Header />
    <div v-if="token" class="container">
      <h1>Votre profil</h1>

      <form enctype="multipart/form-data" class="details" v-for="detail in member" :key="detail.firstName">
        <img class="profilePic" :src="detail.profilePic" alt />
        
        <input v-if="isHidden" type="file" @change="onFileChange" id="addPic" name="addPic" accept="image/jpg, image/png, image/jpeg" />

        <div>
          <label vmode>Prénom : {{detail.firstName}}</label>
          <input v-if="isHidden" v-model="firstName" type="text" name="firstName" :placeholder="detail.firstName" />

          <label>Nom : {{detail.lastName}}</label>
          <input v-if="isHidden" v-model="lastName" type="text" name="lastName" :placeholder="detail.lastName" />

          <label>Date de naissance : {{format_date(detail.birthday)}}</label>
          <input v-if="isHidden" v-model="birthday" type="date" name="birthday"/>

          <label>Poste : {{detail.employement}}</label>
          <input v-if="isHidden" v-model="employement" type="text" name="employement" :placeholder="detail.employement" />

          <label>Date d'entrée dans l'entreprise : {{format_date(detail.inCompanySince)}}</label>
          <input v-if="isHidden" v-model="inCompanySince" type="date" name="inCompanySince"/>
        </div>

        <div>
          <label>Adresse email : {{detail.email}}</label>
          <input v-if="isHidden" v-model="email" type="text" name="email" :placeholder="detail.email" />
        </div>

        <div v-if="detail.isAdmin" :style="{'color':'red'}">
          <p>Cet utilisateur est administrateur</p>
        </div>
      </form>

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
      };
    },
    async created() {
      this.member = await AuthService.getInfo();
    },

    methods: {
      edit() {
        try {
          const formData = new FormData();
          formData.append("file", this.selectedFile);
          formData.append("firstName", this.firstName);
          formData.append("lastName", this.lastName);
          formData.append("birthday", this.birthday);
          formData.append("email", this.email);
          formData.append("inCompanySince", this.inCompanySince);
          formData.append("employement", this.employement);

          const response = AuthService.updateUser(formData).then(() => {
            this.msg = response.msg;
          });
        } catch (error) {
          this.msg = error.response.data.msg;
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
          }}
      },
    },
  };
</script>

<style scoped lang="scss">
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

      &-red{
        background-color: red;
      }
    }

    .profilePic {
      margin: 0 auto;
      width: 200px;
      border-radius: 15px;
    }

    h1 {
      text-align: center;
    }

    #addPic {
      margin: 10px auto 30px;
      background-color: #1fc567;
      border-radius: 10px;
    }

    .details {
      font-size: 1.5em;
      width: 70%;
      margin: auto;
      display: flex;
      flex-direction: column;
      text-align: center;

      div {
        padding: 0;
        list-style: none;
        display: flex;
        flex-direction: column;

        input {
          height: 24px;
          margin: auto;
        }

        label {
          padding: 15px;
        }

        a {
          color: #fff;
        }
      }
    }
  }

  @media all and (max-width: 768px) {
    .container {
      margin: auto;
      width: 80%;
    }

    .details {
      flex-direction: column;
    }

    li {
      padding: 5px;
    }
  }

  @media all and (max-width: 425px) {
    .container {
      width: 100%;
    }
  }
</style>