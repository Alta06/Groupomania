<template>
  <div id="app">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.0/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700;900&display=swap" rel="stylesheet">
  
    <router-view />
    
  </div>
</template>

<script>
  export default {


  }
</script>

<style lang="scss">

$bgColor : #003A4D;

body {
  font-family: 'Lato', sans-serif;
  background-color: $bgColor;
  margin: 0;
  padding: 0;

a {
    color: white;
}
}

@media all and (max-width: 425px) {

  header {
            height: 0;
        }
}

</style>