<template>
<div>
<div>
<div class="float-right">
            <multiselect style="width:500px;" @select="personSelected" @remove="personRemoved" v-model="this.selectedPeople" :max="3" :options="this.peopleList" :close-on-select="true" :select-label="null" :custom-label="renderLabel" :deselect-label="null" :multiple="true"
                placeholder="Select a person"></multiselect>
            <p><small>Found <strong>{{peopleList.length}}</strong> people</small></p>
        </div>
</div>
<div>
    <data-chart ref="personGraph" :width="400" :height="200" :chart-data="personGraph"></data-chart>
</div>
</div>
</template>

<script>
    import {
        mapGetters
    } from 'vuex';
    import Multiselect from 'vue-multiselect'
    import DataChart from '../general/DataChart'
    const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug",
        "Sep", "Oct", "Nov", "Dec"
    ];
    const colors = [
        '0, 0, 255',
        '255,128,0',
        '102,0,204'
    ]
    export default {

        components: {
            Multiselect,
            DataChart
        },
    
        data() {
            return {
                peopleMap: null,
                peopleList: [],
                personGraph: null,
                selectedPeople: []
            }
        },
    
        computed: mapGetters({
            responseData: 'getResults',
            year: 'getYear',
            word: 'getWord'
        }),
    
        watch: {
            responseData(newer, old) {
                this.updateData();
            }
        },
    
        created() {
            this.initGraph();
        },
    
        methods: {
    
            updateData() {
                let people = this.responseData[this.year].people;
                this.$data.peopleMap = people;
                //TODO: once datastructure finalized by team, perform sort in server
                this.$data.peopleList = Object.keys(people).sort((a, b) => {
                    let firstTotal = people[a].reduce((sum, val) => sum + val, 0);
                    let secondTotal = people[b].reduce((sum, val) => sum + val, 0);
                    return secondTotal - firstTotal;
                })
                this.$data.selectedPeople = [this.$data.peopleList[0]];
                this.createPersonData();
            },
    
            renderLabel(item) {
                let articleCount = this.$data.peopleMap[item].reduce((sum, val) => sum + val, 1);
                return `${item} - (${articleCount})`
            },
    
            personSelected(item) {
                this.$data.selectedPeople.push(item);
                this.createPersonData();
            },
    
            personRemoved(removed) {
                this.$data.selectedPeople = this.$data.selectedPeople.filter(item => item !== removed)
                this.createPersonData();
            },

            initGraph() {
                this.$data.personGraph = {
                    labels: labels,
                    datasets: []
                }
            },
    
            createPersonData() {
                const datasets = [];
                for (let i = 0; i < this.$data.selectedPeople.length; i++) {
                    let person = this.$data.selectedPeople[i];
                    let dataset = {
                        label: `Mentions of ${person} and "${this.word}" over ${this.year}`,
                        data: this.$data.peopleMap[person],
                        backgroundColor: [`rgba(${colors[i]}, 0.2`],
                        borderColor: [`rgba(${colors[i]}, 1`]
                    }
                    datasets.push(dataset);
                }
                this.$data.personGraph.datasets = datasets;
                this.$set(this.$data.personGraph, "datasets", datasets)
                this.$refs.personGraph.update();
            },
    
        }
    
    
    }
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css">
