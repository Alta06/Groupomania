<template>
    <div id="adminPosts">
        <h2>Bienvenue sur la page de modération</h2>
        <ul class="postList">
        <li  v-for="(post, index) in posts" :key="post.id">
            <AdminSinglePost @delete-post="deletePost(index)" :post="post"></AdminSinglePost>
        </li>
        </ul>
        
    </div>

</template>

<script>
    import PostService from '../services/PostService';
    import AdminSinglePost from './AdminSinglePost'


    export default {
        name: 'AdminPosts',
        components: {
            AdminSinglePost
        },

        data() {
            return {
                posts: {

                },


            }
        },

        async created() {
            this.posts = await PostService.getAllPost();
        },

 methods: {
            async deletePost(post, index) {

                if (this.posts[index] === post) {
                    this.posts.splice(index, post);
                }
                this.posts = await PostService.getAllPost();

            },


        }

    }
</script>

<style scoped lang="scss">

@media all and (min-width: 768px) {
 #adminPosts {
            width: 80%;
            margin: auto 0 0 auto;
        }
}

h2 {
    color: white;
    text-align: center;
}
        .postList {
    padding: 0;
    margin: 0;
    list-style: none;

}

</style>