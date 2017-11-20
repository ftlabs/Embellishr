<template>
<div>
        <div class="row">
            <div class="col-md-12">
            <br>
            <h3><strong>Word:</strong> {{this.word}}</h3>
            <br>
            <h3><strong>Year:</strong> {{this.year}}</h3>
            </div>
        </div>
        <div class="row" >
            <div class="col-md-6 well">
                <result-chart></result-chart>
            </div>
            <div class="col-md-6 well">
                <facet-chart :kiosk="true" :facetData.sync="this.$data.people" :word.sync="this.$data.word" :year.sync="this.$data.year"></facet-chart>
            </div>
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
                wordYearDataset: [],
                people: [],
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
                    let word, year;
                    [word, year] = pair.split(':');
                    this.$data.wordYearDataset.push({word, year})
                }
                this.rotateData();
                this.interval = setInterval(this.rotateData, this.$data.interval);
            },
            
            rotateData() {
                if (position >= this.$data.wordYearDataset.length) position = 0;
                this.word = this.$data.wordYearDataset[position].word;
                this.year = this.$data.wordYearDataset[position].year;
                position++;
                console.log(position);
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

