<template>
<div>
        <div class="row text-center">
            <div class="col-md-5" style="margin: 0 auto;">
                <form v-on:submit.prevent="fetchResults()">
                    <div class="form-group">
                        <label for="searchWord">Word</label>
                        <input v-model="word" type="text" class="form-control" id="searchWord" placeholder="e.g. Europe">
                        <label for="yearSelect">Year</label>
                        <select placeholder="Select year" id="yearSelect" v-model="year" data-size="10" class="form-control">
                                <option v-for="option in yearList" :value="option" :key="option">
                                    {{ option }}
                                </option>
                            </select>
                    </div>
                </form>
                <button v-show="searchCompleted" @click="clearResults()" class="btn btn-default btn-sm">Reset</button>
                <button :disabled="word == ''" @click="fetchResults()" class="btn btn-primary btn-sm">Submit!</button>
                <span v-if="loading">Loading...</span>
            </div>
        </div>
        <div class="row" v-show="searchCompleted">
            <div class="col-md-6 well">
                <result-chart></result-chart>
            </div>
            <div class="col-md-6 well">
            <people-chart></people-chart>
            </div>
        </div>
</div>    
</template>

<script>
    import Multiselect from 'vue-multiselect'
    import { mapState, mapGetters } from 'vuex'
    import PeopleChart from '../components/GraphView/PeopleChart'
    import ResultChart from '../components/GraphView/ResultsChart'
    
    export default {
    
        components: {
            Multiselect,
            PeopleChart,
            ResultChart
        },

        computed: mapGetters({
            responseData: 'getResults'
        }),

        watch: {
            responseData (newer, old) {
                this.$data.searchCompleted = true;
                this.$data.loading = false;
            }
        },

        data() {
            return {
                loading: false,
                yearList: [],
                searchCompleted: false,
                word: '',
                year: '',
            }
        },

        mounted() {
            this.populateYears();
        },
    
        methods: {
            populateYears() {
                let year = new Date().getFullYear();
                for (var i = 2004; i != year; year--) this.$data.yearList.push(`${year}`)
                this.$data.year = this.$data.yearList[0];
            },
    
            clearResults() {
                this.$data.person = "";
                this.$data.peopleMap = null;
                this.$data.peopleList = [];
                this.$data.year = this.$data.yearList[0]; //set the year to first in select box
                this.$data.word = "";
                this.$data.searchCompleted = false;
            },

            fetchResults() {
                this.$data.loading = true;
                this.$store.commit('updateSearchParams', {word: this.word, year: this.year});
                this.$store.dispatch('FETCH_DATA')
            },        

        }
    }
</script>

