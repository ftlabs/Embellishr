

<script>
import { Line, mixins } from 'vue-chartjs'
const { reactiveProp } = mixins

export default {
  extends: Line,
  props: [],
  mixins: [reactiveProp],
  methods: {
      update() {
          console.log("called again update");
        this.$data._chart.update();
      }

  },
  mounted () {
    const options = {
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
     }
    }
    this.renderChart(this.chartData, options)
  }
}
</script>

<style>

</style>
