<template>
  <div id="app">
    <nav class="navbar is-sticky" role="navigation" aria-label="main navigation">
      <div class="navbar-item blog-title">
        <a href="/">
          <h2 class="title">{{ blogTitle }}</h2>
        </a>
      </div>
    </nav>
    <section class="hero is-warning" v-if="$auth.check()">
      <div class="hero-body">
        <div class="container">
          <p>Signed in as {{ $auth.user().nickname }} </p>
        </div>
      </div>
    </section>
    <section class="hero is-primary">
      <div class="hero-body">
        <div class="container">
          <h3 class="subtitle"> {{ blogDesc}} </h3>
        </div>
      </div>
    </section>
    <section class="section is-hidden-tablet">
      <div class="container">
        <div class="columns">
          <div class="column">
            <label class="label subtitle is-size-7">Search</label>
            <div class="control">
              <form @submit.prevent="do_search" v-if="!searching">
                <input
                  type="text"
                  v-model="searchterm"
                  class="input"
                  placeholder="Search for something...."
                />
              </form>
              <img v-else src="@/assets/loading.gif" />
            </div>
          </div>
          <div class="column">
            <label class="label is-size-7">Browse by tag:</label>
            <select ref="mobiletagselect" @change="filterTag($event)">
              <option>Choose a tag...</option>
              <option
                :selected="t.attributes.name === tag"
                v-for="t in allTags"
                :key="'optiontag_' + t.id"
                :value="t.attributes.name"
              >
                 {{ t.attributes.name }} ({{ t.attributes.taggings_count }})
              </option>
            </select>
          </div>
        </div>
      </div>
    </section>
    <section class="section">
      <div class="container">
        <div class="columns">
          <div class="column is-four-fifths">
            <router-view :key="$route.fullPath" />
          </div>
          <div class="column is-hidden-mobile">
            <h6 class="subtitle">Since 2009.</h6>
            <p class="content">
               Hey! Get updates of new posts on Twitter:
              <a href="https://twitter.com/VinylUnderbite">@VinylUnderbite</a>
            </p>
            <div class="search_wrapper">
              <div class="field">
                <label class="label subtitle is-size-5">Search</label>
                <div class="control">
                  <form @submit.prevent="do_search" v-if="!searching">
                    <input
                      type="text"
                      v-model="searchterm"
                      class="input"
                      placeholder="Search for something...."
                    />
                  </form>
                  <img v-else src="@/assets/loading.gif" />
                </div>
              </div>
            </div>
            <h2 class="subtitle">
              <strong>Browse by:</strong>
            </h2>
            <ul>
              <li>
                 Format:
                <ul>
                  <li>
                    <router-link :to="{ name: 'Blog', params: { blogId: 'lps' } }">LP</router-link>
                  </li>
                  <li>
                    <router-link :to="{ name: 'Blog', params: { blogId: 'cds' } }">CD</router-link>
                  </li>
                  <li>
                    <router-link :to="{ name: 'Blog', params: { blogId: '7s' } }">7"</router-link>
                  </li>
                </ul>
              </li>
            </ul>
            <br />
            <ul>
              <li>
                <router-link :to="{ name: 'Artists' }">Artist</router-link>
              </li>
              <li>
                <router-link :to="{ name: 'Labels' }">Label</router-link>
              </li>
              <li>
                <router-link :to="{ name: 'Dates' }">Posting date</router-link>
              </li>
            </ul>
            <br />
            <ul>
              <li>
                 Tag:
                <ul>
                  <li v-for="t in allTags" :key="'tag_' + t.id">
                    <!-- <a href="#" @click="filterTag(t.attributes.name)">{{ t.attributes.name }}</a> -->
                    <router-link
                      :class="t.attributes.name === tag ? 'activetag' : ''"
                      :to="{ name: 'Index', query: { filterTag: t.attributes.name } }"
                    >
                       {{ t.attributes.name }}
                    </router-link>
                     ({{ t.attributes.taggings_count }})
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
export default {
  name: 'Underbite',
  inject: ['axios'],
  data() {
    return {
      allTags: [],
      blogId: null,
      blog: {},
      tag: null,
      dataOver: false,
      loadingMore: true,
      blogTitle: 'Dislocated Underbite Spinal Alphabetised Encourager Templates',
      blogDesc:
        "I am attempting to listen to all of my records in alphabetical order, sorted alphabetically by artist, then chronologically within the artist scope. I actually file compilations / various artists first (A-Z by title) and then split LPs A-Z and then numbers 0-9 with the numbers as strings, not numeric value. But I'm saving the comps and splits til the end, otherwise I have to start with a 7 LP sound poetry box set and that's not a fun way to start.",
      // page: 1,
      searchterm: '',
      searching: false,
      searchDone: false
    }
  },
  created() {
    // window.addEventListener('scroll', this.scroll())
    if (this.$route.params.blogId) {
      this.blogId = this.$route.params.blogId
    } else {
      this.blogId = 'lps'
    }
    // this.$on('setBlog', (blog) => {
    //   this.blog = blog
    //   this.blogTitle = blog.attributes.name
    //   this.blogDesc = blog.attributes.description
    // })
    // this.$on('setTag', (tag) => {
    //   this.tag = tag
    // })
    // this.$on('syncSearch',(term) => {
    //   this.searchterm = term
    // })
  },
  methods: {
    do_search() {
      this.clearTags()
      this.searching = true
      this.$router.push({ name: 'Index', query: { search: this.searchterm } })
      this.searchDone = this.searchterm
      this.searching = false
      this.scrollToTop()
    },
    clearSearch() {
      this.searchterm = ''
      this.loadingMore = true
      this.searchDone = false
      this.axios.get('/blogs/' + this.blogId + '/records').then((resp) => {
        this.records = resp.data.data
        this.loadingMore = false
        this.searching = false
        this.scrollToTop()
      })
    },
    filterTag(event) {
      this.$router.push('/?filterTag=' + event.target.value)
    },
    clearTags() {
      this.tag = null
      this.loadingMore = true
    },
    scrollToTop() {
      window.scrollTo(0, 0)
    }
    // scroll () {
    //   window.onscroll = () => {
    //     let bottomOfWindow = document.documentElement.scrollTop + window.innerHeight >= document.documentElement.offsetHeight - 25
    //     if (bottomOfWindow && !this.dataOver) {
    //       this.loadingMore = true
    //       this.axios.get('/blogs/' + this.blogId + '/records?page=' + this.page)
    //         .then((response) => {
    //           if (response.data.data.length > 0) {
    //             response.data.data.forEach((entry) => {
    //               this.records.push(entry)
    //             })
    //             this.page++
    //           } else {
    //             this.dataOver = true
    //           }
    //           this.loadingMore = false
    //         })
    //       }
    //   }
    // }
  },
  mounted() {
    this.axios.get('/tags').then((response) => {
      this.allTags = response.data.data
    })
  }
}
</script>
<style lang="scss">
@import 'assets/css/underbite.scss';
</style>
