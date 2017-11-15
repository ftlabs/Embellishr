<template>
    <div class="container">
        <div class="row">
            <div class="col-md-12 text-center">
            </div>
        </div>
        <div class="row text-center">
            <div class="col-md-5" style="margin: 0 auto;">
                <form>
                    <div class="form-group">
                        <label for="exampleFormControlInput1">Word</label>
                        <input v-model="word" type="text" class="form-control" id="searchWord" placeholder="e.g. Europe">
                        <label for="exampleFormControlInput1">Year</label>
                        <select placeholder="Select year" v-model="year" data-size="10" class="form-control" >
                            <option v-for="option in populateYears()" :value="option" :key="option">
                                {{ option }}
                            </option>
                        </select>
                    </div>
                </form>
                <button v-show="!searchCompleted" @click="fetchResults()" class="btn btn-primary btn-sm">Submit!</button>
                <button v-show="searchCompleted" @click="clearResults()" class="btn btn-info btn-sm">Reset</button>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12">
                <div class="float-right" v-if="searchCompleted">
                    <vue-select :on-change="personSelected" style="width:500px;" placeholder="Select a person" v-model="person" :options="peopleList"></vue-select>
                    <small>Found <strong>{{peopleList.length}}</strong> people </small>
                </div>
            </div>
        </div>
        <div class="row" v-show="searchCompleted">
            <div class="col-md-6 well">
                <data-chart ref="resultsGraph" :width="400" :height="200" :chart-data="resultGraph"></data-chart>
            </div>
            <div class="col-md-6 well">
                <data-chart ref="personGraph" :width="400" :height="200" :chart-data="personGraph"></data-chart>
            </div>
        </div>
    
    </div>
</template>

<script>
    import API from './store/API'
    import VueSelect from 'vue-select'
    import DataChart from './components/DataChart'
    const api = new API();
    const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug",
        "Sep", "Oct", "Nov", "Dec"
    ];
    
    export default {
    
        components: {
            VueSelect,
            DataChart
        },
    
        data() {
            return {
                searchCompleted: false,
                year: '',
                word: '',
                peopleMap: null,
                peopleList: [],
                resultGraph: null,
                personGraph: null,
                person: ""
            }
        },
    
        mounted() {
            this.initGraphs();
            this.populateYears();
        },
    
        methods: {
            
            personSelected(item) {
                this.$data.person = item;
                this.createPersonData();
            },

            populateYears() {
                let year = new Date().getFullYear();
                let years = [];
                for (var i = 1980; i != year; year--) years.push(`${year}`)
                return years;
            },
            
    
            clearResults() {
                this.$data.person = "";
                this.$data.peopleMap = null;
                this.$data.peopleList = [];
                this.$data.year = "";
                this.$data.word = "";
                this.$data.resultGraph = null;
                //this.$data.personGraph = null;
                this.$data.searchCompleted = false;
            },
    
            fetchResults() {
                api.getYearResults(this.$data.word, this.$data.year).then(response => {
                    let months = response[this.$data.year].months;
                    let people = response[this.$data.year].people;
                    this.$data.peopleMap = people;
                    this.$data.peopleList = Object.keys(people);
                    this.$data.person = this.$data.peopleList[0];
                    this.createResultData(months)
                    this.createPersonData();
    
                    this.$data.searchCompleted = true;
                });
            },
    
            createResultData(months) {
                let label = `Mentions of "${this.$data.word}" over ${this.$data.year}`
                this.$data.resultGraph = {
                    labels: labels,
                    datasets: [{
                        label: this.$data.word == "" ? "" : label,
                        data: this.$data.word == "" ? [] : months,
                        backgroundColor: [
                            'rgba(255, 159, 64, 0.2)'
                        ],
                        borderColor: [
                            'rgba(255, 159, 64, 1)'
                        ],
                        borderWidth: 2
                    }]
                }
                this.$refs.resultsGraph.update();
            },
    
            initGraphs() {
                this.$data.personGraph = {
                    labels: labels,
                    datasets: [{
                        label: this.person == "" ? "" : this.person,
                        data: this.person == "" ? [] : personData,
                        backgroundColor: [
                            'rgba(0, 0, 255, 0.2)'
                        ],
                        borderColor: [
                            'rgba(0, 0, 255, 1)'
                        ],
                        borderWidth: 2
                    }]
                }
            },
    
            createPersonData() {
                let personData = this.$data.peopleMap[this.$data.person];
                let label = `Mentions of ${this.person} and "${this.word}" over ${this.year}`;
                this.$set(this.$data.personGraph, "datasets", [])
                this.$data.personGraph.datasets.push({
                    label: this.person == "" ? "" : this.person,
                    data: this.person == "" ? [] : personData,
                    backgroundColor: [
                        'rgba(0, 0, 255, 0.2)'
                    ],
                    borderColor: [
                        'rgba(0, 0, 255, 1)'
                    ],
                    borderWidth: 2
                });
                this.$refs.personGraph.update();
            }
    
        }
    }
</script>

<style>
    
</style>
