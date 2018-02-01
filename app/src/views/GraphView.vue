<template>
<div class="o-grid-container">
	    <div class="o-grid-row">
            <div data-o-grid-colspan="12 XL12" style="margin: 0 auto;">
                <form class="o-forms" v-on:submit.prevent="fetchResults()">
                    <div class="form-group">
                        <br>
                        <label class="o-forms__label" for="searchWord">Word</label>
                        <input v-model="word" type="text" class="o-forms__text" id="searchWord" placeholder="e.g. Europe">
                        <br><br>
                        <label class="o-forms__label" for="yearSelect">Year</label>
                        <select placeholder="Select year" id="yearSelect" v-model="year" data-size="10" class="o-forms__select">
                                <option v-for="option in yearList" :value="option" :key="option">
                                    {{ option }}
                                </option>
                            </select>
                    </div>
                    <br>   
                    <button type="button" :disabled="word == ''" @click="fetchResults()" class="o-buttons o-buttons--primary">Submit!</button>
                    <button type="button" v-show="searchCompleted" @click="clearResults()" class="o-buttons o-buttons--secondary">Reset</button>
                </form>
            </div>
        </div>
        <div v-if="loading" class="o-grid-row">
            <div data-o-grid-colspan="12">
            <h4  class="o-typography-heading-level-4 center">
                Searching...
                <span class="o-loading o-loading--dark o-loading--small"></span>
            </h4>
            </div>
	    </div>
        <div class="o-grid-row" style="margin: 0 auto;" v-show="searchCompleted">
            <div data-o-grid-colspan="6 Xl6">
                <h4 class="o-typography-heading-level-4 center">Mentions</h4>
                <result-chart :labels="chartLabels" :resultData.sync="this.$data.monthResults" :word.sync="this.$data.word" :year.sync="this.$data.year"></result-chart>
            </div>
            <div data-o-grid-colspan="6 XL6">
            <h4 class="o-typography-heading-level-4 center">People</h4>
            <facet-chart :labels="chartLabels"   :kiosk="false" :facetData.sync="this.$data.people" :word.sync="this.$data.word" :year.sync="this.$data.year"></facet-chart>
            </div>
        </div>
        <div class="o-grid-row" v-show="searchCompleted">
            <div data-o-grid-colspan="6 XL6">
            <h4 class="o-typography-heading-level-4 center">Organisations</h4>
            <facet-chart :labels="chartLabels" :kiosk="false" :facetData.sync="this.$data.organisations" :word.sync="this.$data.word" :year.sync="this.$data.year"></facet-chart>
            </div>
            <div data-o-grid-colspan="6 XL6">
            <h4 class="o-typography-heading-level-4 center">Topics</h4>
            <facet-chart :labels="chartLabels"  :kiosk="false" :facetData.sync="this.$data.topics" :word.sync="this.$data.word" :year.sync="this.$data.year"></facet-chart>
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
                this.$data.topics = newer[this.year].topics;
                this.$data.chartLabels = newer[this.year].monthLabels;
                this.$data.monthResults = newer[this.year].months;
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
                topics: [],
                chartLabels: [],
                monthResults: [],
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

            track() {
                let oTracking = Origami['o-tracking'];
                oTracking.event({ detail: { category: 'embellishr', action: 'search-home', data: {
                    word: this.word,
                    year: this.year
                } }, bubbles: true});
            },

            extractData() {
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
                this.track();
            },        

        }
    }
</script>
