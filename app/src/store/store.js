import Vue from "vue";
import Vuex from "vuex";
import API from './API'

Vue.use(Vuex);
const api = new API();

const state = {
    word: null,
    year: null,
    responseData: null,
    recentSearchTerms: null
}

const getters = {
    getResults: state => state.responseData,
    getYear: state => state.year,
    getWord: state => state.word,
    getRecentSearchTerms: state => state.recentSearchTerms
}

const mutations = {
    updateSavedData(state, data) {
        state.responseData = data
    },
    updateSearchParams(state, data) {
        state.word = data.word;
        state.year = data.year;
    },
    updateRecentSearchTerms(state, data) {
        state.recentSearchTerms = data.terms;
    }
}

const actions = {
    FETCH_DATA({ commit }) {
        api.getYearResults(this.state.word, this.state.year).then((response) => {
            commit('updateSavedData', response)
        }, () => {
            console.log('Error fetching data')
        })
    },

    FETCH_SEARCH_TERMS({ commit }, numberOfTerms) {
        api.getRecentSearchTerms(numberOfTerms).then(response => {
            commit('updateRecentSearchTerms', response)
        }, () => {
            console.log('Error fetching recent search terms')
        })
    }
}

export default new Vuex.Store({
    state,
    actions,
    getters,
    mutations
});