<template>
     <header>
          <img src="../assets/icon-left-font-monochrome-white-rework.png" alt="">
    </header>
</template>

<script>
export default {
name: 'Header'
}
</script>

<style lang="scss">

header {
    display: flex;
    justify-content: flex-end;

    img {
        margin: 50px;
        width: 500px;
    }
}

@media all and (max-width: 425px) {

    header {

display: none;
        

    }
}

</style>