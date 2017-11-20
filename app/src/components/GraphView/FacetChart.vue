<template>
<div>
<div>
<div class="float-right">
            <multiselect style="width:500px;" @select="personSelected" @remove="personRemoved" v-model="this.selectedFacets" :max="3" :options="this.facetList" :close-on-select="true" :select-label="null" :custom-label="renderLabel" :deselect-label="null" :multiple="true"
                placeholder="Select a person"></multiselect>
            <p><small>Found <strong>{{facetList.length}}</strong> results</small></p>
        </div>
</div>
<div>
    <data-chart ref="facetGraph" :width="400" :height="200" :chart-data="facetGraph"></data-chart>
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

        props: [
            'word',
            'year',
            'facetData'
        ],

        data() {
            return {
                facetMap: null,
                facetList: [],
                facetGraph: {},
                selectedFacets: []
            }
        },
    
        watch: {
            // word(newer, old) {
            //     this.updateData();
            // },
            // year(newer, old) {
            //     this.updateData();
            // },
            facetData(newer, old) {
                this.updateData();
            }
        },
    
        created() {
            this.initGraph();
            console.log("IS CREATED");
        },
    
        methods: {
    
            updateData() {
                let facets = this.facetData;
                this.$data.facetMap = facets;
                console.log(facets);
                //TODO: once datastructure finalized by team, perform sort in server
                this.$data.facetList = Object.keys(facets).sort((a, b) => {
                    let firstTotal = facets[a].reduce((sum, val) => sum + val, 0);
                    let secondTotal = facets[b].reduce((sum, val) => sum + val, 0);
                    return secondTotal - firstTotal;
                })
                this.$data.selectedFacets = [this.$data.facetList[0]];
                this.createPersonData();
            },
    
            renderLabel(item) {
                let articleCount = this.$data.facetMap[item].reduce((sum, val) => sum + val, 1);
                return `${item} - (${articleCount})`
            },
    
            personSelected(item) {
                this.$data.selectedFacets.push(item);
                this.createPersonData();
            },
    
            personRemoved(removed) {
                this.$data.selectedFacets = this.$data.selectedFacets.filter(item => item !== removed)
                this.createPersonData();
            },

            initGraph() {
                this.$data.facetGraph = {
                    labels: labels,
                    datasets: []
                }
            },
    
            createPersonData() {
                const datasets = [];
                for (let i = 0; i < this.$data.selectedFacets.length; i++) {
                    let facet = this.$data.selectedFacets[i];
                    let dataset = {
                        label: `Mentions of ${facet} and "${this.word}" over ${this.year}`,
                        data: this.$data.facetMap[facet],
                        backgroundColor: [`rgba(${colors[i]}, 0.2`],
                        borderColor: [`rgba(${colors[i]}, 1`]
                    }
                    datasets.push(dataset);
                }
                this.$data.facetGraph.datasets = datasets;
                this.$set(this.$data.facetGraph, "datasets", datasets)
                this.$refs.facetGraph.update();
            },
    
        }
    
    
    }
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css">
