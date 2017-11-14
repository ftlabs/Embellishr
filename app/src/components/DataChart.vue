

<script>
import { Line, mixins } from 'vue-chartjs'
const { reactiveProp } = mixins

export default {
  extends: Line,
  props: [],
  mixins: [reactiveProp],
  methods: {

      update() {
        this.$data._chart.update();
      }

  },
  mounted () {
    this.renderChart(this.chartData, this.options)
  }
}
</script>

<style>

</style>
