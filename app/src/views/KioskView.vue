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
    const words = ["Europe", "Brexit", "Bitcoin"]
    const dates = [2017, 2016, 2015];
    let position = 0;
    const TIMEOUT = 7000;

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
                wordYearDataset: []
            }
        },

        mounted() {
            this.populateYears();
            setInterval(this.rotateData, TIMEOUT);
            this.rotateData();
            console.log(this.$route.query);
        },
    
        methods: {

            extractData() {
                const data = this.$route.data;
                let wordYearPairs = data.split(',');
                for(pair in wordYearPairs) {
                    let word, year;
                    [word, year] = pair.split(':');
                    this.$data.wordYearDataset.push({
                        word,
                        year
                    })
                }
            },
            
            rotateData() {
                this.word = words[position];
                this.year = dates[position];
                position++;
                if (position > 2) position = 0;
                this.fetchResults();
            },

            populateYears() {
                let year = new Date().getFullYear();
                for (var i = 2004; i != year; year--) this.$data.yearList.push(`${year}`)
                this.$data.year = this.$data.yearList[0];
            },
    
            fetchResults() {
                this.$data.loading = true;
                this.$store.commit('updateSearchParams', {word: this.word, year: this.year});
                this.$store.dispatch('FETCH_DATA')
            },        

        }
    }
</script>

