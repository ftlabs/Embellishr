<template>
  <div id="app">
    <NavHeader></NavHeader>
    <GraphView></GraphView>
  </div>
</template>

<script>
import NavHeader from './components/NavHeader'
import GraphView from './GraphView'

export default {
  name: 'app',
  components: {
    GraphView,
    NavHeader
  },
  data () {
    return {
      
    }
  }
}
</script>

<style>

</style>
