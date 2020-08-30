<template>

  <div class="formContainer">
    <Sidebar />
    <Header />

    <form class="signInForm" v-if="!token">
      <h2>Déjà inscrit ?</h2>

      <div v-if="this.msg" class="errorMsg">
        <p>{{msg}}</p>
      </div>

      <div class="group">
        <input v-model="email" class="formInput" id="email" type="email" required>
        <label for="email" class="label">Email</label>
      </div>

      <div class="group">
        <input v-model="password" class="formInput" id="password" type="password" required>
        <label for="password" class="label">Mot de passe</label>
      </div>

      <button @click="login" type="button" id="btnSubmit">Connexion</button>
      <div>

        <h3>Pas encore inscrit ?</h3>
        <router-link to="SignUp" id="createAccountBtn">Je crée un compte</router-link>

      </div>
    </form>

    <div v-if="token" class="ifConnected">
      <h2>Vous êtes connecté</h2>
      <a class="button" id="disconnectBtn" @click="logout" href="#">Déconnexion</a>

    </div>


    <Footer />
  </div>

</template>

<script>
  import Sidebar from '../components/Sidebar';
  import Header from '../components/Header';
  import Footer from '../components/Footer';
  import AuthService from '../services/AuthService';

  export default {
    name: 'SignIn',
    components: {
      Sidebar,
      Header,
      Footer
    },
    created() {

    },
    data() {
      return {
        email: '',
        password: '',
        token: this.$store.getters.isLoggedIn,
        msg: ''
      };
    },
    methods: {
      async login(e) {
        try {
          const credentials = {
            email: (this.email).toLowerCase(),
            password: this.password
          }

          if (this.email == '') {
            e.preventDefault();
            this.msg = "Le champ \"email\" est vide";

          } else {

            const response = await AuthService.login(credentials).then((res) => {
              this.msg = response;
              const token = res.token;
              const user = res.userId;

              if (res.message) {
                this.msg = res.message;

              } else {
                this.$store.dispatch('login', {
                  token,
                  user
                });
                this.member = AuthService.getInfo().then((user) => {
                  let type = user[0].isAdmin;
                  this.$store.dispatch('becomeAdmin', {
                    type
                  });
                });


                this.$router.push('/latest');
              }
            });
          }

        } catch (error) {
          this.msg = error;
        }
      },

      logout() {
        this.$store.dispatch('logout');
        this.$router.go();
      },

    },

    computed: {

    }

  }
</script>

<style lang="scss">

  $bgButton : #03C3FF;
  $bgButton2 : #1FC567;

  @mixin button ($bgButton) {
    transition: .4s;
    margin-bottom: 30px;
    border: none;
    background-color: $bgButton;
    width: 320px;
    height: 60px;
    border-radius: 8px;
    color: white;
    font-size: 2em;
    font-weight: bold;
    cursor: pointer;
  }

  #createAccountBtn {
    @include button($bgButton2);
    display: flex;
    justify-content: center;
    align-items: center;
    text-decoration: none;
    &:hover {
            background-color: #14753e;
        }
  }

  #btnSubmit {
    @include button($bgButton);

    &:hover {
            background-color: #006483;
        }
  }

  .ifConnected {

   margin: 25% 0;

    #disconnectBtn {
      @include button(red);
    display: flex;
    justify-content: center;
    align-items: center;
    text-decoration: none;
    margin: auto;
    border: none;
     &:hover {
            background-color: rgb(109, 0, 0);
        }
    }
  }

  .container {
    margin: 50px auto 50px;
    display: flex;
  }

  h2,
  h3 {
    color: white;
    text-align: center;
    margin: 35px 0;
  }

  /* form starting stylings ------------------------------- */

  .signInForm {
    display: flex;
    flex-direction: column;
    align-items: center;


    .errorMsg {
      border-radius: 15px;
      margin: 0 0 50px;
      padding: 10px;
      background-color: red;
      color: white;
      opacity: .8;

    }
  }

  .group {
    position: relative;
    margin-bottom: 45px;
  }

  .formInput {
    font-size: 18px;
    padding: 10px 10px 10px 5px;
    width: 300px;
    border: none;
    border-bottom: 1px solid #ffffff;
    background: #003A4D;
    color: white;
  }

  input:focus {
    outline: none;
  }

  .label {
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
    font-size: 16px;
    color: #ffffff;
  }

@media all and (max-width: 425px) {

  .ifConnected {
     margin: 50% 0%;

  }

}

</style>