<template>
  <div id="app">
    <NavHeader></NavHeader>
    <div class="container">
          <GraphView></GraphView>
    </div>
  </div>
</template>

<script>
import NavHeader from './components/general/NavHeader'
import GraphView from './views/GraphView'

export default {
  name: 'app',
  components: {
    GraphView,
    NavHeader
  }
}
</script>