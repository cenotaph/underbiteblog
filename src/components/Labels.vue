<template>

  <section class="section">
     All labels
    <div v-if="loading">

      <img src="@/assets/loading.gif" />

    </div>

    <ul>

      <li v-for="label in labels" :key="label.id">

        <router-link :to="{ name: 'Index', query: { label: label.attributes.slug } }">
          {{ label.attributes.name }}
        </router-link>

      </li>

    </ul>

  </section>

</template>

<script>
export default {
  data() {
    return {
      labels: [],
      loading: true
    }
  },
  mounted() {
    this.axios.get('/labels').then((resp) => {
      this.labels = resp.data.data
      this.loading = false
    })
  }
}
</script>
