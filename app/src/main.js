import Vue from 'vue'
import App from './App.vue'
import store from './store/store'
import GraphView from './views/GraphView'
import KioskView from './views/KioskView'
import VueRouter from 'vue-router'
Vue.use(VueRouter)
const router = new VueRouter({
  linkExactActiveClass: "active",
  mode: 'history',
  routes: [
      {
        path: '/',
        component: GraphView
      },
      {
        path: '/kiosk',
        component: KioskView
      },
  ]
})


new Vue({
  el: '#app', 
  router,
  render: h => h(App),
  store
})
