<template>
     <nav>
      <ul>

        <li>
          <router-link to="/SignIn"><em class="power fas fa-power-off"></em></router-link>
        </li>
        <li >
          <router-link to="/latest"><em class="clock far fa-clock"></em></router-link>
        </li>
        <li >
          <router-link to="/User"><em class="user fas fa-user-cog"></em></router-link>
        </li>
        <li v-if="$store.getters.type === 1">
            <router-link to="/Admin"><em class="admin fas fa-tools"></em></router-link>
        </li>

      </ul>
      <div class="two"></div>
    </nav>
</template>

<script>

export default {
    
name: 'sidebar',
data () {
    return {

    }
},
    
}

</script>

<style lang="scss">

$bgColor : #003A4D;

nav {
    z-index: 1;
    background: white;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    width: 100px;
    position: fixed;
    top: 0;
    left: 0;

    .two {
        z-index: -1;
        position: absolute;
        left: 0;
        transform: skewX(5deg);
        width: 220px;
        min-height: 100vh; //142.3vh
        background: white;
        box-shadow: 6px 3px 6px;
        position: fixed;
        top: 0;
    }

    ul {
        list-style: none;
        margin: auto;

        li {
            padding: 50px;

            font-size: 2.5em;

            em {
                width: 40px;
                text-align: center;
                border: solid black 3px;
                padding: 10px;
                border-radius: 50px;
                color: black;
                transition: .4s ease-in-out;
            }
        }
    }
}

@mixin hoverButton {
    transition: .4s;
    background-color: $bgColor;
    color: #fff;
    box-shadow: 0 0 20px $bgColor;
}

.router-link-exact-active em {
    @include hoverButton()
}

.power:hover {
    @include hoverButton()
}

.admin:hover {
    @include hoverButton();
    cursor: pointer;
    

}

.clock:hover {
    @include hoverButton()

}

.user:hover {
    @include hoverButton()

}

@media all and (max-width: 1440px)

{
    nav {
        width: 100px;
        ul {
          padding: 0;

        }
        .two {
            width: 170px;
        }
    }
}

@media all and (max-width: 768px) {
    nav {
        width: 50px;

        ul {
            li {
                padding: 50px 0 50px 5px;

                em {
                    font-size: 0.7em;

                }
            }
        }
        .two {
            width: 100px;
        }
    }

    

}

@media all and (max-width: 425px) { 

    nav {
        width: 100%;
        display: flex;
        flex-direction: row;
        min-height: 50px;
        bottom: 0;
        top: 91%;
        box-shadow: -2px -2px 3px;

        ul {
            display: flex;
            
            li {
                font-size: 1.8em;
                padding: 5px;
            }
        }
        .two {
            display: none;
        }
    }
}

</style>