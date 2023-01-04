import Vue from 'vue';
import Vuex from 'vuex';
import app from './modules/app';
import createPersistedState from "vuex-persistedstate"

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        LOADING: false,
        thisAuto:[],
        // menuList:[]
    },
    mutations: {
        changeTitle(state, val) {
            state.app.cardTitle = val
            state.app.currentPath[2].title = val
        },
        showLoading(state) {
            state.LOADING = true
        },
        hideLoading(state) {
            state.LOADING = false
        },
        getThisAuto(state,val){
            state.thisAuto=val;
        },
        saveMenuList(state,val){
            state.menuList=val;
        }

    },
    actions: {

    },
    modules: {
        app,

    },
    plugins:[
        createPersistedState({
        storage: window.sessionStorage
    })
]
});

export default store;