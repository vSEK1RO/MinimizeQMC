import {createRouter, createWebHistory} from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'qmc',
    meta: { title: 'QMC' },
    component: () => import('../views/QmcView.vue')
  },
  {
    path: '/veitch',
    name: 'veitch',
    meta: { title: 'Veitch' },
    component: () => import('../views/VeitchView.vue')
  }
]

const router = createRouter({
  history: createWebHistory('MinimizeQMC'),
  routes
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title;
  next();
});

export default router
