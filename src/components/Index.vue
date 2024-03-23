<template>
  <div>
    <div class="notification is-primary" v-if="tag">
      <button class="delete" @click="clearTags"></button>
      <h6 class="subtitle">
         Filtering by tag :
        <em> {{ tag }}</em>
      </h6>
    </div>
    <div class="notification is-primary" v-if="searchDone">
      <button class="delete" @click="clearSearch"></button>
      <h6 class="subtitle">
         Filtering by search term :
        <em> {{ searchDone }}</em>
      </h6>
    </div>
    <div class="notification is-primary" v-if="artistFilter">
      <button class="delete" @click="clearFilters"></button>
      <h6 class="subtitle">
         Filtering by artist:
        <em> {{ artistFilter }}</em>
      </h6>
    </div>
    <div class="notification is-primary" v-if="labelFilter">
      <button class="delete" @click="clearFilters"></button>
      <h6 class="subtitle">
         Filtering by label:
        <em> {{ labelFilter }}</em>
      </h6>
    </div>
    <!-- <router-view/> -->
    <div class="left_container" v-if="records.length > 0 && !loadingMore">
      <div class="records" v-for="record in records" :key="'record_' + tag + record.id">
        <Album :record="record" />
      </div>
    </div>
    <div v-else-if="records.length == 0 && !loadingMore">
      <h6 class="subtitle">Sorry, nothing matches this criteria.</h6>
    </div>
    <div class="loading has-text-centered" v-show="loadingMore">
      <img src="@/assets/loading.gif" />
    </div>
  </div>
</template>
<script>
import Album from '@/components/Album.vue'
export default {
  inject: ['axios'],
  components: {
    Album
  },
  name: 'Index',
  props: ['filterTag'],
  data() {
    return {
      allTags: [],
      artistFilter: null,
      blogId: null,
      blog: {},
      tag: null,
      checkme: {},
      dataOver: false,
      labelFilter: null,
      loadingMore: true,
      blogTitle: 'Dislocated Underbite Spinal Alphabetised Encourager Templates',
      page: 1,
      records: [],
      searchterm: '',
      searching: false,
      searchDone: false
    }
  },
  created() {
    window.addEventListener('scroll', this.scroll())
    if (this.$route.params.blogId) {
      this.blogId = this.$route.params.blogId
    } else {
      this.blogId = 'lps'
    }
  },
  methods: {
    clearFilters() {
      this.$router.push('/')
    },
    clearSearch() {
      this.$parent.$emit('clearSearch')
      this.searchDone = false
      this.axios.get('/blogs/' + this.blogId + '/records').then((resp) => {
        this.records = resp.data.data
        this.loadingMore = false
        this.searching = false
        this.scrollToTop()
      })
    },
    clearTags() {
      this.tag = null
      this.loadingMore = true
      this.$parent.$emit('setTag', null)
      this.axios.get('/blogs/' + this.blogId + '/records').then((resp) => {
        this.records = resp.data.data
        this.loadingMore = false
        this.scrollToTop()
      })
    },
    scrollToTop() {
      window.scrollTo(0, 0)
    },
    scroll() {
      window.onscroll = () => {
        let bottomOfWindow =
          document.documentElement.scrollTop + window.innerHeight >=
          document.documentElement.offsetHeight - 25
        if (bottomOfWindow && !this.dataOver && !this.loadingMore) {
          this.page++
          this.loadingMore = true
          let url = '/blogs/' + this.blogId + '/records?page=' + this.page
          if (this.$route.query.filterTag) {
            url += '&by_tag=' + this.$route.query.filterTag
          }
          if (this.$route.query.artist) {
            url += '&by_artist=' + this.$route.query.artist
          }
          if (this.$route.query.label) {
            url += '&by_label=' + this.$route.query.label
          }
          this.axios.get(url).then((response) => {
            if (response.data.data.length > 0) {
              response.data.data.forEach((entry) => {
                this.records.push(entry)
              })
            } else {
              this.dataOver = true
            }
            this.loadingMore = false
          })
        }
      }
    }
  },
  mounted() {
    if (this.$route.params.blogId) {
      this.blogId = this.$route.params.blogId
    } else {
      this.blogId = 'lps'
    }
    if (this.$route.query.filterTag) {
      this.scrollToTop()
      this.$parent.$emit('clearSearch')
      this.tag = this.$route.query.filterTag
      this.$parent.$emit('setTag', this.$route.query.filterTag)
      this.loadingMore = true
      this.axios.get('/records.json?by_tag=' + this.tag).then((resp) => {
        this.records = resp.data.data
        this.loadingMore = false
      })
    } else if (this.$route.query.artist) {
      this.tag = null
      this.axios.get('/artists/' + this.$route.query.artist).then((r) => {
        this.artistFilter = r.data.data.attributes.name
      })
      this.axios.get('/records?by_artist=' + this.$route.query.artist).then((resp) => {
        this.records = resp.data.data
        this.$parent.$emit(
          'setBlog',
          resp.data.included.filter((x) => {
            return x['attributes']['slug'] === this.blogId
          })[0]
        )
        this.loadingMore = false
      })
    } else if (this.$route.query.label) {
      this.tag = null
      this.axios.get('/labels/' + this.$route.query.label).then((r) => {
        this.labelFilter = r.data.data.attributes.name
      })
      this.axios.get('/records?by_label=' + this.$route.query.label).then((resp) => {
        this.records = resp.data.data
        this.$parent.$emit(
          'setBlog',
          resp.data.included.filter((x) => {
            return x['attributes']['slug'] === this.blogId
          })[0]
        )
        this.loadingMore = false
      })
    } else if (this.$route.query.search) {
      this.tag = null
      this.$parent.$emit('syncSearch', this.$route.query.search)
      this.searchDone = this.$route.query.search
      this.axios.post('/search', { search: this.$route.query.search }).then((resp) => {
        this.records = resp.data.data
        this.loadingMore = false
      })
    } else {
      this.axios.get('/blogs/' + this.blogId + '/records').then((resp) => {
        this.records = resp.data.data
        this.$parent.$emit(
          'setBlog',
          resp.data.included.filter((x) => {
            return x['attributes']['slug'] === this.blogId
          })[0]
        )
        this.loadingMore = false
      })
    }
  }
}
</script>
 }
