import Vue from 'vue'
import App from './App.vue'
import store from './store/store'
console.log(store);
new Vue({
  el: '#app', 
  render: h => h(App),
  store
})
