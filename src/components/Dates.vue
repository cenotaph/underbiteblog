<template>

  <section class="section">

    <h2 class="subtitle">All posts by date:</h2>

    <div v-if="loading">

      <img src="@/assets/loading.gif" />

    </div>

    <ul>

      <li v-for="month in dates" :key="month[0][0] + '_' + month[0][1]">
         {{monthNames[month[0][1]] }} {{ month[0][0]}} ({{ month[1].length }})
        <ul class="smaller">

          <li class="is-size-6" v-for="record in month[1]" :key="record.id">

            <router-link :to="{ name: 'Album', params: { id: record.slug } }">
              {{ record.display_name }}
            </router-link>
          </li>

        </ul>

      </li>

    </ul>

  </section>

</template>

<script>
export default {
  data() {
    return {
      dates: [],
      loading: true,
      monthNames: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
      ]
    }
  },
  mounted() {
    this.axios.get('/records/calendar').then((resp) => {
      this.dates = resp.data
      this.loading = false
    })
  }
}
</script>
