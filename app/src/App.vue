<template>
  <div id="app">
    <NavHeader></NavHeader>
    <div class="container-fluid">
          <router-view></router-view>
    </div>
  </div>
</template>

<script>
import NavHeader from './components/general/NavHeader'

export default {
  name: 'app',
  components: {
    NavHeader
  }
}
</script>