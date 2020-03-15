import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        themes: {
            light: {
                primary: "#3B125F",
                secondary: "#8B5FBF",
                accent: "#BF653F",
                error: "#722530",
                warning: "#A37513",
                info: "#396893",
                success: "#4CAF50"
            }
        }
    }
});
