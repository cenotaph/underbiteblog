import { createRouter, createWebHistory } from 'vue-router'

import Login from '@/components/Login.vue'
import Album from '@/components/Album.vue'
import Index from '@/components/Index.vue'
import Artists from '@/components/Artists.vue'
import Labels from '@/components/Labels.vue'
import Dates from '@/components/Dates.vue'

import AlbumList from '@/components/AlbumList.vue'
import EditAlbum from '@/components/EditAlbum.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { auth: false }
  },
  {
    path: '/albums',
    name: 'AlbumList',
    component: AlbumList,
    meta: { auth: true }
  },
  {
    path: '/albums/:id/edit',
    name: 'EditAlbum',
    component: EditAlbum,
    meta: { auth: true }
  },
  {
    path: '/artists',
    name: 'Artists',
    component: Artists
  },
  {
    path: '/calendar',
    name: 'Dates',
    component: Dates
  },
  {
    path: '/labels',
    name: 'Labels',
    component: Labels
  },
  {
    path: '/albums/new',
    name: 'New',
    component: EditAlbum,
    meta: { auth: true }
  },
  {
    path: '/:blogId/:id',
    component: Album,
    name: 'Album'
  },
  {
    path: '/',
    component: Index,
    name: 'Index',
    props: true
  },
  {
    path: '/:blogId',
    component: Index,
    name: 'Blog'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
