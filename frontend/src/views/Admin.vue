<template>
  <div class="latestPosts">
    <Sidebar />
    <Header />
    <AdminPosts />
    
    <Footer />


  </div>
</template>

<script>
  // @ is an alias to /src
  import Sidebar from '../components/Sidebar';
  import Header from '../components/Header';
  import Footer from '../components/Footer';
  import AdminPosts from '../components/AdminPosts'


  export default {
    name: 'Admin',
    components: {
      Sidebar,
      Header,
      Footer,
      AdminPosts
    }

  }
</script>

<style lang="scss">
  
</style>