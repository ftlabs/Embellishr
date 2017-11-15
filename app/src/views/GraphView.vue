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
                <button :disabled="word == ''" @click="fetchResults()" class="btn btn-primary btn-sm">Submit!</button>
                <button v-show="searchCompleted" @click="clearResults()" class="btn btn-default btn-sm">Reset</button>
                        <span v-if="loading">Loading...</span>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12">
                <div class="float-right" v-show="searchCompleted">
                    <multiselect 
                    style="width:500px;" 
                    @select="personSelected" 
                    v-model="person" 
                    :options="peopleList" 
                    :close-on-select="true" 
                    :select-label="null"
                    :custom-label="renderLabel"
                    :deselect-label="null" 
                    :clear-on-select="false" 
                    placeholder="Select a person"></multiselect>
                    <p><small>Found <strong>{{peopleList.length}}</strong> people</small></p>
                    <p><small>Click <strong>here</strong> to view articles associated with this person</small></p>
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
    import API from '../store/API'
    import Multiselect from 'vue-multiselect'
    import DataChart from '../components/general/DataChart'
    
    const api = new API();
    const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug",
        "Sep", "Oct", "Nov", "Dec"
    ];
    
    export default {
    
        components: {
            Multiselect,
            DataChart,
        },
    
        data() {
            return {
                loading: false,
                yearList: [],
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

            renderLabel(item) {
                let articleCount = this.$data.peopleMap[item].reduce((sum, val) => sum + val, 1);
                return `${item} - (${articleCount})`
            },
    
            personSelected(item) {
                this.$data.person = item;
                this.createPersonData();
            },
    
            populateYears() {
                let year = new Date().getFullYear();
                for (var i = 1980; i != year; year--) this.$data.yearList.push(`${year}`)
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
                api.getYearResults(this.$data.word, this.$data.year).then(response => {
                    let months = response[this.$data.year].months;
                    let people = response[this.$data.year].people;
                    this.$data.peopleMap = people;
                    this.$data.peopleList = Object.keys(people);
                    this.$data.person = this.$data.peopleList[0];
                    this.createResultData(months)
                    this.createPersonData();
    
                    this.$data.searchCompleted = true;
                    this.$data.loading = false;
                });
            },
    
            initGraphs() {
                this.$data.personGraph = {
                    labels: labels,
                    datasets: [{
                        label: '',
                        data: [],
                        backgroundColor: [
                            'rgba(0, 0, 255, 0.2)'
                        ],
                        borderColor: [
                            'rgba(0, 0, 255, 1)'
                        ],
                        borderWidth: 2
                    }]
                }
    
                this.$data.resultGraph = {
                    labels: labels,
                    datasets: [{
                        label: "",
                        data: [],
                        backgroundColor: [
                            'rgba(255, 159, 64, 0.2)'
                        ],
                        borderColor: [
                            'rgba(255, 159, 64, 1)'
                        ],
                        borderWidth: 2
                    }]
                }
            },
    
            createResultData(months) {
                let label = `Mentions of "${this.$data.word}" over ${this.$data.year}`
                this.$set(this.$data.resultGraph.datasets[0], "data", months)
                this.$set(this.$data.resultGraph.datasets[0], "label", label)
                this.$refs.resultsGraph.update();
            },
    
            createPersonData() {
                let personData = this.$data.peopleMap[this.$data.person];
                let label = `Mentions of ${this.person} and "${this.word}" over ${this.year}`;
                this.$set(this.$data.personGraph.datasets[0], "data", personData)
                this.$set(this.$data.personGraph.datasets[0], "label", label)
                this.$refs.personGraph.update();
            }
    
        }
    }
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css">

