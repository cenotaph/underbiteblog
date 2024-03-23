<template>
  <div v-if="album" :id="'album_' + album.id" class="container record">
    <h2 class="title">
      <router-link
        :to="{ name: 'Album', params: { blogId: album.attributes.blog_slug, id: album.attributes.slug } }"
      >
         {{ album.attributes.display_name }}
      </router-link>
    </h2>
    <div class="content">
      <img class="image_left" align="left" v-if="album.attributes.image" :src="album.attributes.image" />
      <p class="content" v-html="album.attributes.review"></p>
    </div>
    <div class="level">
      <router-link
        tag="button"
        v-if="$auth.check()"
        class="button is-link"
        :to="{ name: 'EditAlbum', params: { id: album.attributes.slug } }"
      >
         Edit
      </router-link>
      <p v-if="!album.attributes.published">
        <strong>UNPUBLISHED!</strong>
      </p>
      <p class="content">
        <em>posted: {{ $moment(album.attributes.published_at).format('Do MMMM YYYY h:mm a') }} </em>
      </p>
    </div>
    <div class="columns">
      <div class="column tags">
        <router-link
          :to="{ name: 'Index', query: { filterTag: tag } }"
          class="tag is-link"
          v-for="tag in album.attributes.tag_list"
          :key="album.id + tag"
        >
           {{ tag }}
        </router-link>
      </div>
    </div>
    <div v-if="album.attributes.related.length > 0">
      <div class="hero">
        <div class="column">
          <h2 class="subtitle">Possibly related records:</h2>
        </div>
      </div>
      <div class="container">
        <RelatedSlider :related="album.attributes.related" />
      </div>
    </div>
  </div>
</template>
<script>
import RelatedSlider from '@/components/RelatedSlider.vue'
export default {
  inject: ['axios'],
  name: 'album',
  components: {
    RelatedSlider
  },
  props: {
    record: Object
  },
  data() {
    return {
      album: this.record
    }
  },
  mounted() {
    if (!this.album) {
      if (this.$route.params.blogId) {
        this.axios
          .get('/blogs/' + this.$route.params.blogId + '/records/' + this.$route.params.id)
          .then((resp) => {
            this.album = resp.data.data
            this.scrollToTop()
          })
      } else {
        this.axios.get('/records/' + this.$route.params.id).then((resp) => {
          this.album = resp.data.data
          this.scrollToTop()
        })
      }
    }
  },
  methods: {
    scrollToTop() {
      window.scrollTo(0, 0)
    },
    sendTag(tag) {
      this.$emit('filterTag', tag)
    }
  }
}
</script>
