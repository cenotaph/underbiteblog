<template>
  <section class="section">
     All albums
    <div v-if="loading">
      <img src="@/assets/loading.gif" />
    </div>
    <table v-else class="table">
      <thead>
        <th>id</th>
        <th>Title</th>
        <th>Published?</th>
        <th>Actions</th>
      </thead>
      <tbody>
        <tr v-for="album in albums" :key="album.id">
          <td>{{ album.id }}</td>
          <td>{{ album.attributes.display_name }}</td>
          <td>{{ album.attributes.published }}</td>
          <td>
            <router-link
              class="button is-link"
              :to="{ name: 'EditAlbum', params: { id: album.attributes.slug } }"
            >
               Edit
            </router-link>
          </td>
        </tr>
      </tbody>
    </table>
  </section>
</template>
<script>
export default {
  inject: ['axios'],
  data() {
    return {
      albums: [],
      loading: true
    }
  },
  mounted() {
    this.axios.get('/records').then((resp) => {
      this.albums = resp.data.data
      this.loading = false
    })
  }
}
</script>
