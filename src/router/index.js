import { createRouter, createWebHistory } from 'vue-router'

import SplashScreen from '@/pages/Home/SplashScreen.vue'
import SurahList from '@/pages/Surah/SurahList.vue'
import AyatList from '@/pages/Surah/AyatList.vue'
import JuzList from '@/pages/Juz/JuzList.vue'
import JuzDetail from '@/pages/Juz/JuzDetail.vue'

const routes = [
  { path: '/', component: SplashScreen },
  { path: '/surah-list', component: SurahList },
  { 
    path: '/surah/:surahId', 
    component: AyatList, 
    props: route => ({ surahId: Number(route.params.surahId) }) 
  },
  { path: '/juz-list', component: JuzList },
  { 
    path: '/juz/:juzNumber', 
    component: JuzDetail, 
    props: route => ({ juzNumber: Number(route.params.juzNumber) }) 
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
