<template>
  <v-container mt-5 pt-5>
    <!--   Add Post Title -->

    <v-row justify="center">
      <v-flex xs12 sm6 offset-sm3>
        <h1 class="text--primary">Create Post</h1>
      </v-flex>
    </v-row>

    <!--    Add Post Form -->

    <v-layout row wrap>
      <v-flex xs12 sm6 offset-sm3>
        <v-form @submit.prevent="handleAddPost" v-model="isFormValid" lazy-validation ref="form">
          <!-- Title Input -->
          <v-row>
            <v-flex xs12>
              <v-text-field :rules="titleRules" v-model="title" label="Post Title" type="text" required />
            </v-flex>
          </v-row>

          <v-row>
            <v-flex xs12>
              <v-text-field :rules="imageRules" v-model="imageUrl" label="Image URL" type="text" required />
            </v-flex>
          </v-row>

          <!--  Image Preview -->

          <v-row>
            <v-flex xs12>
              <img :src="imageUrl" height="300px" />
            </v-flex>
          </v-row>

          <!--  Categories Select -->

          <v-row>
            <v-flex xs12>
              <v-select :rules="categoriesRules" v-model="categories" :items="['Art', 'Education', 'Travel', 'Food', 'Furniture', 'Photography', 'Technology']" multiple label="Categories"> </v-select>
            </v-flex>
          </v-row>

          <!--  Description Text Area -->

          <v-row>
            <v-flex xs12>
              <v-textarea :rules="descRules" v-model="description" label="Description" type="text" required />
            </v-flex>
          </v-row>

          <v-row class="text-center">
            <v-flex xs12>
              <v-btn :loading="loading" :disabed="!isFormValid || loading" color="info" type="submit">
                <span slot="loader" class="custom-loader">
                  <v-icon light>mdi-reload</v-icon>
                </span>
                Submit
              </v-btn>
            </v-flex>
          </v-row>
        </v-form>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import { mapGetters } from 'vuex';

export default {
  name: 'AddPost',
  data() {
    return {
      isFormValid: true,
      title: '',
      imageUrl: '',
      categories: [],
      description: '',
      titleRules: [title => !!title || 'Title is required', title => title.length < 20 || 'Title must have less than 20 characters'],
      imageRules: [image => !!image || 'Image is required'],
      categoriesRules: [categories => categories.length >= 1 || 'At least one category is required'],
      descRules: [desc => !!desc || 'Description is required', desc => desc.length < 200 || 'Description must have less than 200 characters'],
    };
  },
  computed: {
    ...mapGetters(['loading', 'user']),
  },
  methods: {
    handleAddPost() {
      // add post action

      if (this.$refs.form.validate()) {
        this.$store.dispatch('addPost', {
          title: this.title,
          imageUrl: this.imageUrl,
          categories: this.categories,
          description: this.description,
          creatorId: this.user._id,
        });
        this.$router.push('/');
      }
    },
  },
};
</script>
