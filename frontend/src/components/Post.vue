<template>
    <div class="post">
        <div v-for="(post, index) in posts" :key="post.id">
            <SinglePost @delete-post="deletePost(index)" :post="post"></SinglePost>
        </div>
    </div>

</template>

<script>
    import PostService from '../services/PostService';
    import SinglePost from './SinglePost'


    export default {
        name: 'Post',
        components: {
            SinglePost
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">


</style>