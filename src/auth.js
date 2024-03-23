import { createAuth } from '@websanova/vue-auth/dist/v3/vue-auth'
import * as driverHttpAxios from '@websanova/vue-auth/dist/drivers/http/axios.1.x'
import * as driverDevise from '@websanova/vue-auth/dist/drivers/auth/devise'
import * as driverRouterVueRouter from '@websanova/vue-auth/dist/drivers/router/vue-router.2.x'
import router from './router'
import http from '@/http'

export default (app) => {
  app.use(
    createAuth({
      plugins: {
        http: http,
        router: router
      },
      drivers: {
        http: driverHttpAxios,
        auth: driverDevise,
        router: driverRouterVueRouter
      },
      options: {
        refreshTokenKey: 'auth_refresh_token',
        stores: ['localStorage', 'storage'],
        loginData: {
          url: import.meta.env.VITE_APP_AUTH_PATH + '/auth/sign_in',
          method: 'POST',
          redirect: '/'
        },
        logoutData: {
          url: import.meta.env.VITE_APP_AUTH_PATH + '/auth/sign_out',
          method: 'DELETE',
          redirect: '/login'
        },
        fetchData: {
          enabled: true,
          url: import.meta.env.VITE_APP_AUTH_PATH + '/auth/validate_token',
          method: 'GET',
          interval: 5
        },
        refreshData: {
          enabled: true,
          url: import.meta.env.VITE_APP_AUTH_PATH + '/auth/validate_token',
          method: 'GET',
          interval: 5
        }
      }
    })
  )
}
