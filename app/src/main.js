import Vue from 'vue'
import App from './App.vue'
import store from './store/store'
import GraphView from './views/GraphView'
import KioskView from './views/KioskView'
import VueRouter from 'vue-router'
import DocsView from './views/DocsView'
Vue.use(VueRouter)
const router = new VueRouter({
  linkExactActiveClass: "o-header-services__nav-link--selected",
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
      {
        path: '/docs',
        component: DocsView
      }
  ]
})


new Vue({
  el: '#app', 
  router,
  render: h => h(App),
  store
})
