<template>
  <v-container mt-5 pt-5>
    <!--     Signin Title -->

    <v-row justify="center">
      <v-flex xs12 sm6 offset-sm3>
        <h1>Welcome Back</h1>
      </v-flex>
    </v-row>

    <!--     Error Alert -->
    <v-layout v-if="error" row wrap>
      <v-flex xs12 sm6 offset-sm3>
        <form-alert :message="error.message" />
      </v-flex>
    </v-layout>

    <!--    Signin Form -->

    <v-layout row wrap>
      <v-flex xs12 sm6 offset-sm3>
        <v-card color="secondary" dark>
          <v-container>
            <v-form @submit.prevent="handleSigninUser" v-model="isFormValid" lazy-validation ref="form">
              <v-row>
                <v-flex xs12>
                  <v-text-field :rules="usernameRules" v-model="username" prepend-icon="face" label="Username" type="text" required />
                </v-flex>
              </v-row>
              <v-row>
                <v-flex xs12>
                  <v-text-field :rules="passwordRules" v-model="password" prepend-icon="extension" label="Password" type="password" required> </v-text-field>
                </v-flex>
              </v-row>
              <v-row class="text-center">
                <v-flex xs12>
                  <v-btn :loading="loading" :disabled="!isFormValid || loading" color="accent" type="submit">
                    <span slot="loader" class="custom-loader">
                      <v-icon light>cached</v-icon>
                    </span>
                    Sign-in
                  </v-btn>
                  <h3>
                    Don't have an account ?
                    <router-link to="/signup">Sign-up</router-link>
                  </h3>
                </v-flex>
              </v-row>
            </v-form>
          </v-container>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import { mapGetters } from 'vuex';

export default {
  name: 'Signin',
  data() {
    return {
      isFormValid: true,
      username: '',
      password: '',
      usernameRules: [(username) => !!username || 'Username is required', (username) => username.length < 10 || 'Username must be less than 10 characters'],
      passwordRules: [(password) => !!password || 'Password is required', (password) => password.length >= 4 || 'Username must be at least 4 characters']
    };
  },
  computed: {
    ...mapGetters(['loading', 'error', 'user'])
  },
  watch: {
    user(value) {
      // if user changes redirect to home page

      if (value) {
        this.$router.push('/');
      }
    }
  },
  methods: {
    handleSigninUser() {
      if (this.$refs.form.validate()) {
        this.$store.dispatch('signinUser', {
          username: this.username,
          password: this.password
        });
      }
    }
  }
};
</script>

<style>
.custom-loader {
  animation: loader 1s infinite;
  display: flex;
}
@-moz-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-webkit-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-o-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
