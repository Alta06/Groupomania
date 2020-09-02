<template>

  <div class="formContainer">
    <Sidebar />
    <Header />
    <form class="signUpForm">
      <h2>Pas encore inscrit ?</h2>

        <div v-if="this.msg" class="errorMsg">
          <p> Nous avons trouvé une erreur :</p>
          <p>{{msg}}</p>
        </div>

      <div class="group">
        <input v-model="firstName" class="formInput" id="firstName" required type="text" maxlength="20">
        <label for="firstName" class="label">Prénom</label>
      
      </div>

      <div class="group">
        <input v-model="lastName" class="formInput" id="lastName" required type="text" maxlength="20">
        <label for="lastName" class="label">Nom</label>
       
      </div>

      <div class="group">
        <input v-model="email" class="formInput" id="email" required type="email">
        <label for="email" class="label">Email</label>
       
      </div>

      <div class="group">
        <input v-model="password" class="formInput" id="password" required type="password" maxlength="25">
        <label for="password" class="label">Mot de passe</label>
      
      </div>

      <div class="group">
        <input v-model="password_repeat" class="formInput" id="password_repeat" required type="password" maxlength="25">
        <label for="password_repeat" class="label">Confirmez le mot de passe</label>
        
      </div>
      <button type="button" @click="signUp" id="btnSubmit">Créer un compte</button>
      <div>

        <h3>Déjà inscrit ?</h3>
        <router-link to="SignIn" id="goToConnect">Je me connecte</router-link>

      </div>
    </form>
    <Footer />

  </div>

</template>

<script>
  // @ is an alias to /src
  import Sidebar from '../components/Sidebar';
  import Header from '../components/Header';
  import Footer from '../components/Footer';
  import AuthService from '../services/AuthService';

  export default {
    name: 'SignUp',
    components: {
      Sidebar,
      Header,
      Footer
    },
    data() {
      return {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        password_repeat: '',
        msg: "",
        isInvalid: true

      };
    },
    methods: {
      async signUp(e) {

    const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

        try {
          const credentials = {
            firstName: this.firstName,
            lastName: this.lastName,
            email: (this.email).toLowerCase(),
            password: this.password,
            password_repeat: this.password_repeat
          };
          if (this.firstName == '') {
            this.msg = "Le champ \"prénom\" est vide";
            e.preventDefault();
          } else if (this.lastName == ''){
            this.msg = "Le champ \"nom\" est vide";
            e.preventDefault();
          } else if (!this.email.match(emailRegex)) {
            this.msg = "L'adresse mail est invalide";
            
            e.preventDefault();
          } else if (!this.password.match(passRegex)) {
            this.msg = "Le mot de passe n'est pas assez sécurisé: Au moins 8 caractères, une majuscule, un chiffre, un caractère spécial.";
            e.preventDefault();
          } 
          
          else if (this.password != this.password_repeat) {
            this.msg = "Les mots de passe ne correspondent pas";
            e.preventDefault();
          } else {
          const response = await AuthService.signup(credentials);
          this.msg = response;
          this.$router.push('/signin');
            }
          

        } catch (error) {
          this.msg = error;
          return false;
        }
      },

    }
  }
</script>

<style lang="scss">

$btnTextClr: #003A4D;

@mixin btn {
  display: flex;
  margin: auto;
  justify-content: center;
  align-items: center;
  width: 250px;
  height: 50px;
  border: none;
  cursor: pointer;
  color: $btnTextClr;
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

  .container {
    margin: 50px auto 50px;
    display: flex;

  }

  hr {
    width: 50%;
    margin: auto;
  }

  h2,
  h3 {
    color: white;
    text-align: center;
    margin: 35px 0;
  }

  /* form starting stylings ------------------------------- */

  .signUpForm {
    display: flex;
    flex-direction: column;
    align-items: center;

    .errorMsg {
      width: 50%;
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
    background: $btnTextClr;
    color: white;

  }

  #firstName, #lastName, #email, #password, #confirm_password {
        &:valid {
      border-bottom: 2px solid rgb(0, 185, 0);
    }
  }

  input:focus {
    outline: none;
  }

  /* LABEL ======================================= */
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
    font-size: 14px;
    color: #ffffff;
  }

</style>