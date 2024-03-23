<template>

  <section class="section">
     All artists
    <div v-if="loading">

      <img src="@/assets/loading.gif" />

    </div>

    <ul>

      <li v-for="artist in artists" :key="artist.id">

        <router-link :to="{ name: 'Index', query: { artist: artist.attributes.slug } }">
          {{ artist.attributes.name }}
        </router-link>

      </li>

    </ul>

  </section>

</template>

<script>
export default {
  data() {
    return {
      artists: [],
      loading: true
    }
  },
  mounted() {
    this.axios.get('/artists').then((resp) => {
      this.artists = resp.data.data
      this.loading = false
    })
  }
}
</script>
