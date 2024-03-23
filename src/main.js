import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import http from '@/http'

import moment from 'moment'
import auth from './auth'
import store from './store'

const app = createApp(App)
app.config.globalProperties.$moment = moment
app.use(router)
app.use(store)
app.use(auth)
app.provide('axios', http)
app.mount('#app')
