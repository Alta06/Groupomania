<template>
      <footer>
        <img src="@/assets/icon-left-font-monochrome-white.png" alt="">
        <p>| Enterprise social network | by Antoine Lbt</p>
    </footer>
</template>

<script>
export default {
name: 'Footer'
}
</script>

<style lang="scss">

footer {
    color: #fff;
    display: flex;
    justify-content: center;
    margin-bottom: 80px;

    p {
        align-self: center;
        margin-left: 5px;
    }
    img {
        width: 150px;
    }
}

@media all and (max-width: 425px) {

      footer {
        flex-direction: row;

          p {
              margin: 5px;
              font-size: .8em;
          }
        img {
            margin: 0;
            width: 150px;
        }
    }
}

</style>