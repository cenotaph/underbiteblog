<template>
  <carousel :items-to-show="3">
    <slide v-for="item in related" :key="item[0] + item[1]">
      <div class="column">
        <figure class="image">
          <img :src="item[2]" />
        </figure>
      </div>
      <div class="column">
        <p class="is-size-6">
          <router-link :to="{ name: 'Album', params: { blogId: item[0], id: item[1] } }">
             {{ item[3] }}
          </router-link>
        </p>
      </div>
    </slide>
    <template #addons="{ related } ">
      <Navigation  />
    </template>
  </carousel>
</template>
<script>
import 'vue3-carousel/dist/carousel.css'
import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel'
export default {
  name: 'RelatedSlider',
  components: {
    Carousel,
    Slide,
    Pagination,
    Navigation,
  },
  props: {
    related: Array,
    carouselId: String
  }
}
</script>
