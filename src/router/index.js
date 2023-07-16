import { createRouter, createWebHistory } from 'vue-router'
import MspaPage from '@/views/MspaPage.vue'
import NotFound from '@/views/NotFound.vue'

const routes = [
  {
    path: '/:story/:page?',
    name: 'mspa-page',
    component: MspaPage,
    props: true,
  },
  // /story/ -> /story/{firstPage}, which varies per adventure
  // for 'hs', it's /story/001901
  // for 'ps', it's /story/000219
  // redirect goes below
  {
    path: '/:story/',
    redirect: (to) => {
      if (to.params.story === 'ps') return `/${to.params.story}/000219`;
      if (to.params.story === 'hs') return `/${to.params.story}/001901`;
      return `/${to.params.story}/000001`;
    }
  },
  // also redirect / to /hs until a main page actually exists
  {
    path: '/',
    redirect: '/hs'
  },
  { 
    path: '/:pathMatch(.*)*', 
    name: 'not-found', 
    component: NotFound 
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE_URL),
  routes,
})

export default router