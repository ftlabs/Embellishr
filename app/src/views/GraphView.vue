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
            <div class="col-md-6">
                <h4 class="text-center">Mentions</h4>
                <result-chart></result-chart>
            </div>
            <div class="col-md-6">
            <h4 class="text-center">People</h4>
            <facet-chart :kiosk="false" :facetData.sync="this.$data.people" :word.sync="this.$data.word" :year.sync="this.$data.year"></facet-chart>
            </div>
        </div>
        <div class="row" v-show="searchCompleted">
            <div class="col-md-6">
            <h4 class="text-center">Organisations</h4>
            <facet-chart :kiosk="false" :facetData.sync="this.$data.organisations" :word.sync="this.$data.word" :year.sync="this.$data.year"></facet-chart>
            </div>
        </div>
       
</div>    
</template>

<script>
    import Multiselect from 'vue-multiselect'
    import { mapState, mapGetters } from 'vuex'
    import ResultChart from '../components/GraphView/ResultsChart'
    import FacetChart from '../components/GraphView/FacetChart'
    
    export default {
    
        components: {
            Multiselect,
            ResultChart,
            FacetChart
        },

        computed: mapGetters({
            responseData: 'getResults'
        }),

        watch: {
            responseData (newer, old) {
                this.$data.searchCompleted = true;
                this.$data.loading = false;     
                this.$data.organisations = newer[this.year].organisations;
                this.$data.people = newer[this.year].people;
            }
        },

        data() {
            return {
                loading: false,
                yearList: [],
                searchCompleted: false,
                word: '',
                year: '',
                organisations: [],
                people: [],
            }
        },

        // beforeRouteUpdate (to, from, next) {
        //     this.extractData();
        //     next();
        // },

        mounted() {
            this.populateYears();
            this.extractData();
        },
    
        methods: {

            extractData(to=null) {
                if(!this.$route.query.hasOwnProperty('data')) {
                    return;
                }
                const data = this.$route.query.data;
                let word, year;
                [word, year] = data.split(':');
                this.$data.word = word;
                this.$data.year = year;
                this.fetchResults();
            },

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
                let dataString = `${this.$data.word}:${this.$data.year}`;
                let routeData = {query: { data: dataString }};
                this.$router.replace(routeData);
            },        

        }
    }
</script>

