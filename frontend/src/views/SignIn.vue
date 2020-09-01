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
      <div class="notSignedIn">

        <h3>Pas encore inscrit ?</h3>
        <router-link to="SignUp" id="createAccount">Je crée un compte</router-link>

      </div>
    </form>

    <div v-if="token" class="ifConnected">
      <h2>Vous êtes connecté</h2>
      <button class="button" id="disconnectBtn" @click="logout" href="#">Déconnexion</button>

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
  font-size: 1.5em;
  font-weight: bold;
  transition: .4s ease-in-out;

  &:hover {
    box-shadow: inset #003d75 0px 0px 0px 50px;
    color: white;
  }
}

#btnSubmit {
  @include btn;
}

.notSignedIn {
  display: flex;
  flex-direction: column;
  align-items: center;
}

  .ifConnected {

    #disconnectBtn {
      @include btn; 

      &:hover {
    box-shadow: inset red 0px 0px 10px 50px;
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