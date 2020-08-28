<template>
  <div class="latestPosts">
    <Sidebar />
    <Header />
    <NewPost />

    <Post />
    <Footer />


  </div>
</template>

<script>
  // @ is an alias to /src
  import Sidebar from '../components/Sidebar';
  import Header from '../components/Header';
  import Footer from '../components/Footer';
  import Post from '../components/Post';
  import NewPost from '../components/NewPost'

  export default {
    name: 'LatestPosts',
    components: {
      Sidebar,
      Header,
      Footer,
      Post,
      NewPost
    }

  }
</script>

<style lang="scss">
  @media all and (max-width: 425px) {

   
    header {
      display: none;
    }

  }
</style>