<template>
  <v-container>
    <v-layout row>
      <v-dialog v-model="loading" persistent fullscreen>
        <v-container fill-height>
          <v-layout row justify-center align-center>
            <v-progress-circular indeterminate :size="70" :width="7" color="secondary"> </v-progress-circular>
          </v-layout>
        </v-container>
      </v-dialog>
    </v-layout>

    <v-layout class="mt-2 mb-2" row wrap v-if="!loading" justify-center>
      <v-flex xs12>
        <v-layout justify-center row>
          <v-btn class="secondary" to="/posts"> Explore posts</v-btn>
        </v-layout>
      </v-flex>
    </v-layout>

    <!-- Posts Carousel  -->

    <v-flex xs12>
      <v-carousel v-if="!loading && posts.length > 0" v-bind="{ cycle: true }" interval="3000">
        <v-carousel-item @click.native="goToPost(post._id)" v-for="post in posts" :key="post._id" :src="post.imageUrl">
          <h1 id="carousel__title">{{ post.title }}</h1>
        </v-carousel-item>
      </v-carousel>
    </v-flex>
  </v-container>
</template>

<script>
  import { mapGetters } from 'vuex';

  export default {
    name: 'home',
    created() {
      this.handleGetCarouselPosts();
    },
    computed: {
      ...mapGetters(['loading', 'posts'])
    },
    methods: {
      handleGetCarouselPosts() {
        // reach out to Vuex store, fire action to get posts
        this.$store.dispatch('getPosts');
      },
      goToPost(postId) {
        this.$router.push(`/posts/${postId}`);
      }
    }
  };
</script>
<style>
  #carousel__title {
    position: absolute;
    cursor: pointer;
    text-align: center;
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
    border-radius: 5px 5px 0 0;
    padding: 0.5em;
    margin: 0 auto;
    bottom: 50px;
    left: 0;
    right: 0;
  }
</style>
