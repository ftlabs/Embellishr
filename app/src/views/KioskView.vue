<template>
<div class="container-fluid">
        <div class="row">
            <div class="col-md-12">
                <br>
            <h1 class="display-4"><strong style="color:#566c73">Word of the year:</strong> "{{this.word}}" - <em>{{this.year}}</em> </h1>
            </div>
        </div>
        <div class="row">
            <div class="col-lg-6">
                <result-chart :kiosk="true"></result-chart>
            </div>
            <div class="col-lg-6 facetChart">
                <facet-chart :kiosk="true" :facetData.sync="this.$data.facetData" :word.sync="this.$data.word" :year.sync="this.$data.year"></facet-chart>
            </div>
        </div>
        <h3 class="text-center">Try this at <strong>https://ftlabs-embellishr.herokuapp.com/</strong></h5>
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
            responseData: 'getResults'
        }),

         beforeDestroy() {
            clearInterval(this.interval);
         },

        watch: {
            responseData (newer, old) {
                this.$data.searchCompleted = true;
                this.$data.loading = false;
                let facetData;
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
            }
        },

        data() {
            return {
                loading: false,
                yearList: [],
                searchCompleted: false,
                word: '',
                year: '',
                facetType: '',
                wordYearDataset: [],
                facetData: [],
                interval: 5000
            }
        },

        mounted() {
            this.extractData();
        },
    
        methods: {

            extractData() {
                if(!this.$route.query.hasOwnProperty('data')) {
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
                    this.$data.wordYearDataset.push({word, year, type})
                }
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
                this.$data.loading = true;
                this.$store.commit('updateSearchParams', {word: this.word, year: this.year});
                this.$store.dispatch('FETCH_DATA')
            },        

        }
    }
</script>
<style>
    .facetChart {
        margin-top: 30px;
    }
</style>
