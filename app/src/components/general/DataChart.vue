

<script>
import { Line, mixins } from 'vue-chartjs'
const { reactiveProp } = mixins

export default {
  extends: Line,
  props: [
      'kiosk'
  ],
  mixins: [reactiveProp],
  methods: {
      update() {
        this.$data._chart.update();
      },

      getOptions() {
          
      }

  },
  mounted () {
    const options = {
      legend: {
          labels: {}
      },
      responsive: true,
      scales: {
         yAxes: [{
             ticks: {
                 beginAtZero: true,
                 userCallback: function(label, index, labels) {
                     if (Math.floor(label) === label) {
                         return label; //Remove decimal points
                     }

                 },
             }
         }],
         xAxes: [{
             ticks: {

             }
         }]
     }
    }
    
    if(this.kiosk) {
        options.scales.yAxes[0].ticks.fontSize=20;
        options.scales.xAxes[0].ticks.fontSize=20;
        options.legend.labels.fontSize = 20;
    }

    this.renderChart(this.chartData, options)
  }
}
</script>

<style>

</style>
