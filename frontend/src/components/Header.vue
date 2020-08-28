<template>
     <header>
          <h1>Groupomania</h1>
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
    height: 150px;

    h1 {
        padding: 20px;
        font-size: 4em;
        color: white;
    }
}

@media all and (max-width: 425px) {

    header {
        justify-content: center;

        h1 {
           display: none;
        }
    }
}

</style>