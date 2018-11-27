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
        if(typeof this.state.year === 'undefined' || !this.state.year) {
            api.getRelativeYearResults(this.state.word).then((response) => {
                commit('updateSavedData', response)
            }, (e) => {
                console.log('Error fetching relative year data')
                console.log(e);
            })
        }
        else {
            api.getYearResults(this.state.word, this.state.year).then((response) => {
                commit('updateSavedData', response)
            }, (e) => {
                console.log('Error fetching data')
                console.log(e)
            })
        }
    },

    FETCH_SEARCH_TERMS({ commit }) {
        api.getDefaultSearchTerms().then(response => {
            commit('updateRecentSearchTerms', response)
        }, (e) => {
            console.log('Error fetching recent search terms')
            console.log(e);
        })
    }
}

export default new Vuex.Store({
    state,
    actions,
    getters,
    mutations
});