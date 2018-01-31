<template>
<div class="kiosk-container">
        <div class="o-grid-row o-grid-row--compact">
            <div data-o-grid-colspan="12">
                <br>
                <h1 class="o-typography-headline"><strong>&nbsp;Word Of The Year?&nbsp;</strong> "{{this.word}}" - {{this.year}}</h1>
            </div>
        </div>
        <h3 v-if="loading" class="center o-typography-heading-level-3">Retrieving most recent search terms...
            <span class="o-loading o-loading--dark o-loading--small"></span>
        </h3>
        
        <div class="o-grid-row o-grid-row--compact">
            <div data-o-grid-colspan="XL6">
                <result-chart :labels="chartLabels" :kiosk="true" :resultData.sync="this.$data.monthResults" :word.sync="this.$data.word" :year.sync="this.$data.year"></result-chart>
            </div>
            <div data-o-grid-colspan="XL6" class="facetChart">
                <facet-chart :labels="chartLabels" :kiosk="true" :facetData.sync="this.$data.facetData" :word.sync="this.$data.word" :year.sync="this.$data.year"></facet-chart>
            </div>
        </div>
        <h4 class="center o-typography-heading-level-4">Try this at <strong>https://ftlabs-embellishr.herokuapp.com/</strong></h4>
        </div>
</div>
</template>

<script>
    import Multiselect from 'vue-multiselect'
    import { mapState, mapGetters } from 'vuex'
    import FacetChart from '../components/GraphView/FacetChart'
    import ResultChart from '../components/GraphView/ResultsChart'
    let position = 0;

    export default {

        components: {
            Multiselect,
            ResultChart,
            FacetChart
        },

        computed: mapGetters({
            responseData: 'getResults',
            searchTerms: 'getRecentSearchTerms'
        }),

         beforeDestroy() {
            clearInterval(this.interval);
         },

        watch: {
            responseData (newer, old) {
                let facetData;
                if(typeof this.year == 'undefined') {
                    const currentYear = new Date().getFullYear()
                    const previousYear = new Date().getFullYear() - 1;
                    const yearRange = `${previousYear}-${currentYear}`
                    this.year = yearRange;
                }
                switch(this.facetType) {
                    case "people":
                        facetData = newer[this.year].people;
                        break;
                    case "organisations":
                        facetData = newer[this.year].organisations;
                        break;
                    case "topics":
                        facetData = newer[this.year].topics;
                        break;
                    default:
                        facetData = newer[this.year].people;
                        break;
                }
                this.$data.facetData = facetData;
                this.$data.chartLabels = newer[this.year].monthLabels;
                this.$data.monthResults = newer[this.year].months;
            },
            searchTerms (newer, old) {
                this.$route.query.data = newer.join(',');
                this.extractData();
                this.$data.loading = false;
            }
        },

        data() {
            return {
                yearList: [],
                word: '',
                year: '',
                facetType: '',
                wordYearDataset: [],
                facetData: [],
                monthResults: [],
                interval: 15000,
                loading: false,
                chartLabels: []
            }
        },

        mounted() {
            this.extractData();
        },

        methods: {

             track(data) {
                let oTracking = Origami['o-tracking'];
                oTracking.event({ detail: { category: 'embellishr', action: 'search-kiosk', data: {
                    query: data
                } }, bubbles: true});
            },

            extractData() {
                if(!this.$route.query.hasOwnProperty('data') || this.$route.query.data === null) {
                    const num = (!this.$route.query.hasOwnProperty('num') || this.$route.query.num === null || this.$route.query.num < 1)? 10 : this.$route.query.num;
                    this.$data.loading = true;
                    this.$store.dispatch('FETCH_SEARCH_TERMS',num);
                    return;
                }
                if(this.$route.query.hasOwnProperty('interval')) {
                    this.$data.interval = this.$route.query.interval * 1000;
                }
                const data = this.$route.query.data;
                let wordYearPairs = data.split(',');
                for(let pair of wordYearPairs) {
                    let word, year, type;
                    [word, year, type] = pair.split(':');
                    word = (word === ''       )? 'brexit' : word;
                    type = (type === undefined)? 'people' : type;
                    this.$data.wordYearDataset.push({word, year, type})
                }
                this.track(data);
                this.rotateData();
                this.interval = setInterval(this.rotateData, this.$data.interval);
            },

            rotateData() {
                if (position >= this.$data.wordYearDataset.length) position = 0;
                this.word = this.$data.wordYearDataset[position].word;
                this.year = this.$data.wordYearDataset[position].year;
                this.facetType = this.$data.wordYearDataset[position].type;
                position++;
                this.fetchResults();
            },

            fetchResults() {
                this.$store.commit('updateSearchParams', {word: this.word, year: this.year});
                this.$store.dispatch('FETCH_DATA');
            },

        }
    }
</script>
<style>
    .kiosk-container {
        padding: 40px;
    }

    .kiosk-container h1 {
        font-size: 3.5em;
    }

    .kiosk-container h4 {
        padding-top: 10px;
    }

    .facetChart {
        margin-top: 59px;
    }
</style>
