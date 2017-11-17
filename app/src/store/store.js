import Vue from "vue";
import Vuex from "vuex";
import API from './API'

Vue.use(Vuex);
const api = new API();

const state = {
    word: null,
    year: null,
    responseData: null
}

const getters = {
    getResults: state => state.responseData,
    getYear: state => state.year,
    getWord: state => state.word
}

const mutations = {
    updateSavedData (state, data) {
          state.responseData = data
      },
    updateSearchParams (state, data) {
          state.word = data.word;
          state.year = data.year;
    }
}

const actions = {
    FETCH_DATA ({ commit }) {
        api.getYearResults(this.state.word, this.state.year).then((response) => {
            commit('updateSavedData', response)
        }, () => {
            console.log('Error fetching data')
        })
        }
}

export default new Vuex.Store({
    state,
    actions,
    getters,
    mutations
});