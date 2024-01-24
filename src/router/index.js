import {createRouter, createWebHistory} from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'qmc',
    meta: { title: 'QMC' },
    component: () => import('../views/QmcView.vue')
  },
  {
    path: '/beta',
    name: 'beta',
    meta: { title: 'Beta' },
    component: () => import('../views/BetaView.vue')
  }
]

const router = createRouter({
  history: createWebHistory('MinimizeQMC'),
  routes
})

router.beforeEach((to, from, next) => {
  console.log(to);
  document.title = to.meta.title;
  next();
});

export default router
