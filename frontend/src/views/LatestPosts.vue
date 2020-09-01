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

.container {
  display: flex;
}

@media all and (min-width: 768px) and (max-width: 1024px) {
.latestPosts {
    width: 80%;
    margin: auto 0 0 auto;
}
}

</style>