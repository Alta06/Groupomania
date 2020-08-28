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
        img {
            margin: auto;
            width: 150px;
        }
        flex-direction: column;
        margin-bottom: 100px;
    }
}

</style>