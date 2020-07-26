import Vue from 'vue';
import Vuex from 'vuex';
import router from '../router';
import { apolloClient } from '../main';
import { GET_CURRENT_USER, GET_POSTS, SIGNIN_USER, SIGNUP_USER, UPDATE_USER_POST, ADD_POST, DELETE_USER_POST, SEARCH_POSTS, GET_USER_POSTS, INFINITE_SCROLL_POSTS } from '../queries';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    posts: [],
    userPosts: [],
    user: null,
    loading: false,
    error: null,
    authError: null,
    searchResults: [],
  },
  mutations: {
    setPosts: (state, payload) => {
      state.posts = payload;
    },
    setSearchResults: (state, payload) => {
      if (payload !== null) {
        state.searchResults = payload;
      }
    },
    setUser: (state, payload) => {
      state.user = payload;
    },
    setUserPosts: (state, payload) => {
      state.userPosts = payload;
    },
    setLoading: (state, payload) => {
      state.loading = payload;
    },
    setError: (state, payload) => {
      state.error = payload;
    },
    setAuthError: (state, payload) => {
      state.authError = payload;
    },
    clearError: state => (state.error = null),

    clearSearchResults: state => (state.searchResults = []),

    clearUser: state => (state.user = null),
  },

  actions: {
    getCurrentUser: ({ commit }) => {
      commit('setLoading', true);
      apolloClient
        .query({
          query: GET_CURRENT_USER,
        })
        .then(({ data }) => {
          commit('setLoading', false);
          commit('setUser', data.getCurrentUser);
        })
        .catch(err => {
          commit('setLoading', false);
          console.error(err);
        });
    },
    getPosts: ({ commit }) => {
      commit('setLoading', true);

      // use Apollo client to fire action

      apolloClient
        .query({
          query: GET_POSTS,
        })
        .then(({ data }) => {
          // get data from actions to state via mutations
          // commit passes data from actions to mutation functions
          commit('setPosts', data.getPosts);
          commit('setLoading', false);
        })
        .catch(err => {
          commit('setLoading', false);
          console.error(err);
        });
    },
    getUserPosts: ({ commit }, payload) => {
      apolloClient
        .query({
          query: GET_USER_POSTS,
          variables: payload,
        })
        .then(({ data }) => {
          commit('setUserPosts', data.getUserPosts);
        })
        .catch(err => console.error(err));
    },
    searchPosts: ({ commit }, payload) => {
      apolloClient
        .query({
          query: SEARCH_POSTS,
          variables: payload,
        })
        .then(({ data }) => {
          commit('setSearchResults', data.searchPosts);
        })
        .catch(err => console.error(err));
    },
    signupUser: ({ commit }, payload) => {
      commit('clearError');
      commit('setLoading', true);

      apolloClient
        .mutate({
          mutation: SIGNUP_USER,
          variables: payload,
        })
        .then(({ data }) => {
          commit('setLoading', false);
          localStorage.setItem('token', data.signupUser.token);

          router.go();
        })
        .catch(err => {
          commit('setLoading', false);
          commit('setError', err);
          console.error(err);
        });
    },

    addPost: ({ commit }, payload) => {
      apolloClient
        .mutate({
          mutation: ADD_POST,
          variables: payload,
          update: (cache, { data: { addPost } }) => {
            // read query to update
            const data = cache.readQuery({ query: GET_POSTS });
            // add to array
            data.getPosts.unshift(addPost);
            // write back to query
            cache.writeQuery({ query: GET_POSTS, data });
          },
          optimisticResponse: {
            __typename: 'Mutation',
            addPost: {
              __typename: 'Post',
              _id: -1,
              ...payload,
            },
          },
          refreshQueries: [
            {
              query: INFINITE_SCROLL_POSTS,
              variables: {
                pageNum: 1,
                pageSize: 2,
              },
            },
          ],
        })
        .then(({ data }) => {
          console.log(data.addPost);
        })
        .catch(err => {
          console.error(err);
        });
    },
    updateUserPost: ({ state, commit }, payload) => {
      apolloClient
        .mutate({
          mutation: UPDATE_USER_POST,
          variables: payload,
        })
        .then(({ data }) => {
          const index = state.userPosts.findIndex(post => post._id === data.updateUserPost._id);
          const userPosts = [...state.userPosts.slice(0, index), data.updateUserPost, ...state.userPosts.slice(index + 1)];
          commit('setUserPosts', userPosts);
        })
        .catch(err => {
          console.error(err);
        });
    },
    deleteUserPost: ({ state, commit }, payload) => {
      apolloClient
        .mutate({
          mutation: DELETE_USER_POST,
          variables: payload,
        })
        .then(({ data }) => {
          const index = state.userPosts.findIndex(post => post._id === data.deleteUserPost._id);
          const userPosts = [...state.userPosts.slice(0, index), ...state.userPosts.slice(index + 1)];
          commit('setUserPosts', userPosts);
        })
        .catch(err => {
          console.error(err);
        });
    },
    signinUser: ({ commit }, payload) => {
      commit('clearError');
      commit('setLoading', true);

      apolloClient
        .mutate({
          mutation: SIGNIN_USER,
          variables: payload,
        })
        .then(({ data }) => {
          commit('setLoading', false);
          localStorage.setItem('token', data.signinUser.token);

          router.go();
        })
        .catch(err => {
          commit('setLoading', false);
          commit('setError', err);
          console.error(err);
        });
    },
    signoutUser: async ({ commit }) => {
      // clear user in state

      commit('clearUser');

      // remove token from localStorage

      localStorage.setItem('token', '');

      // end Session

      await apolloClient.resetStore();

      // redirect to home

      router.push('/').catch(error => {
        if (error.name != 'NavigationDuplicated') {
          throw error;
        }
      });
    },
  },
  getters: {
    posts: state => state.posts,
    userPosts: state => state.userPosts,
    searchResults: state => state.searchResults,
    user: state => state.user,
    userFavorites: state => state.user && state.user.favorites,
    loading: state => state.loading,
    error: state => state.error,
    authError: state => state.authError,
  },
  modules: {},
});
