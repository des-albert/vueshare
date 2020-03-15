<template>
  <v-app style="background: #E3E3EE">
    <!-- Side Navbar -->

    <v-navigation-drawer app temporary fixed v-model="sideNav">
      <v-app-bar color="accent" dark flat>
        <v-app-bar-nav-icon @click="toggleSideNav" />
        <router-link to="/" tag="span" style="cursor:pointer">
          <h1 class="title pl-3">VueShare</h1>
        </router-link>
      </v-app-bar>

      <v-divider />

      <!-- Side Navbar Links -->

      <v-list style="cursor:pointer">
        <v-list-item v-for="item in sideNavItems" :key="item.title" :to="item.link">
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <!--      Signout Button -->

        <v-list-item v-if="user" @click="handleSignoutUser">
          <v-list-item-action>
            <v-icon>exit_to_app</v-icon>
          </v-list-item-action>
          <v-list-item-content>Signout</v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Horizontal NavBar -->

    <v-app-bar fixed color="primary" dark max-height="80px">
      <v-app-bar-nav-icon @click="toggleSideNav"> </v-app-bar-nav-icon>
      <v-toolbar-title class="hidden-xs-only">
        <router-link to="/" tag="span" style="cursor:pointer">
          VueShare
        </router-link>
      </v-toolbar-title>

      <v-spacer />

      <!-- Search Input -->

      <v-text-field flex v-model="searchTerm" @input="handleSearchPosts" prepend-icon="search" placeholder="Search posts" color="accent" single-line hide-details></v-text-field>

      <!-- Search Results Card -->

      <v-card dark v-if="searchResults.length" id="search__card">
        <v-list>
          <v-list-item v-for="result in searchResults" :key="result._id" @click="goToSearchResult(result._id)">
            <v-list-item-title>
              {{ result.title }} -
              <span class="font-weight-thin">{{ formatDescription(result.description) }}</span>
            </v-list-item-title>
            <v-list-item-action v-if="checkIfUserFavorite(result._id)">
              <v-icon>favorite</v-icon>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-card>

      <v-spacer />

      <!-- Horizontal Navbar Links -->

      <v-toolbar-items class="hidden-xs-only">
        <v-btn text v-for="item in horizontalNavItems" :key="item.title" :to="item.link">
          <v-icon left class="hidden-sm-only">{{ item.icon }} </v-icon>
          {{ item.title }}
        </v-btn>

        <!-- Profile Button -->

        <v-btn text to="/profile" v-if="user">
          <v-icon class="hidden-sm-only" left>account_box</v-icon>
          <v-badge right color="blue darken-2" :class="{ bounce: badgeAnimated }">
            <span slot="badge" v-if="userFavorites.length">{{ userFavorites.length }}</span>
            Profile
          </v-badge>
        </v-btn>

        <!-- Signout Button -->

        <v-btn text v-if="user" @click="handleSignoutUser">
          <v-icon class="hidden-sm-only" left>exit_to_app</v-icon>
          Signout
        </v-btn>
      </v-toolbar-items>
    </v-app-bar>

    <!-- App Content -->
    <main>
      <v-container class="app-content">
        <transition name="fade" mode="out-in" duration="250">
          <router-view />
        </transition>

        <!-- Auth Snackbar -->

        <v-snackbar color="success" bottom left v-model="authSnackbar" :timeout="5000">
          <v-icon class="mr-3">check_circle</v-icon>
          <h3>You are now signed in</h3>
          <v-btn dark text @click="authSnackbar = false">Close</v-btn>
        </v-snackbar>

        <!-- Auth Error Snackbar -->

        <v-snackbar v-if="authError" color="warning" bottom left v-model="authErrorSnackbar" :timeout="5000">
          <v-icon class="mr-3">cancel</v-icon>
          <h3>{{ authError.message }}</h3>
          <v-btn dark text to="/signin">Signin</v-btn>
        </v-snackbar>
      </v-container>
    </main>
  </v-app>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  name: "App",
  data() {
    return {
      searchTerm: "",
      sideNav: false,
      authSnackbar: false,
      authErrorSnackbar: false,
      badgeAnimated: false
    };
  },
  watch: {
    user(newValue, oldValue) {
      if (oldValue === null) {
        this.authSnackbar = true;
      }
    },
    authError(value) {
      if (value !== null) {
        this.authErrorSnackbar = true;
      }
    },
    userFavorites(value) {
      if (value) {
        this.badgeAnimated = true;
        setTimeout(() => (this.badgeAnimated = false), 1000);
      }
    }
  },
  computed: {
    ...mapGetters(["searchResults", "authError", "user", "userFavorites"]),
    horizontalNavItems() {
      let items = [
        { icon: "chat", title: "Posts", link: "/posts" },
        { icon: "lock_open", title: "Sign In", link: "/signin" },
        { icon: "create", title: "Sign Up", link: "/signup" }
      ];
      if (this.user) {
        items = [{ icon: "chat", title: "Posts", link: "/posts" }];
      }
      return items;
    },
    sideNavItems() {
      let items = [
        { icon: "chat", title: "Posts", link: "/posts" },
        { icon: "lock_open", title: "Sign In", link: "/signin" },
        { icon: "create", title: "Sign Up", link: "/signup" }
      ];

      if (this.user) {
        items = [
          { icon: "chat", title: "Posts", link: "/posts" },
          { icon: "stars", title: "Create Post", link: "/post/add" },
          { icon: "account_box", title: "Profile", link: "/profile" }
        ];
      }
      return items;
    }
  },
  methods: {
    handleSearchPosts() {
      this.$store.dispatch("searchPosts", {
        searchTerm: this.searchTerm
      });
    },
    handleSignoutUser() {
      this.$store.dispatch("signoutUser");
    },
    goToSearchResult(resultId) {
      // clear search term

      this.searchTerm = "";

      // go to desired result

      this.$router.push(`/posts/${resultId}`);

      // Clear Search Results

      this.$store.commit("clearSearchResults");
    },
    formatDescription(desc) {
      return desc.length > 30 ? `${desc.slice(0, 30)}...` : desc;
    },
    checkIfUserFavorite(resultId) {
      return (
        this.userFavorites &&
        this.userFavorites.some(fave => fave._id === resultId)
      );
    },
    toggleSideNav() {
      this.sideNav = !this.sideNav;
    }
  }
};
</script>
<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 250ms ease;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
#search__card {
  position: absolute;
  width: 100vw;
  z-index: 8;
  top: 100%;
  left: 0%;
}
/* User Favorite Animation */
h1 {
  font-weight: 400;
  font-size: 2.5rem;
}

h2 {
  font-weight: 400;
  font-size: 2rem;
}
.bounce {
  animation: bounce 1s both;
}
.app-content {
  margin-top: 3rem;
}
@keyframes bounce {
  0%,
  20%,
  53%,
  80%,
  100% {
    transform: translate3d(0, 0, 0);
  }
  40%,
  43% {
    transform: translate3d(0, -20px, 0);
  }
  70% {
    transform: translate3d(0, -10px, 0);
  }
  90% {
    transform: translate3d(0, -4px, 0);
  }
}
</style>
