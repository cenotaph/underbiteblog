<template>

  <section class="main-content section container is-fullheight">

    <div class="container">

      <div class="columns">

        <div class="column is-one-third">

          <h1>Login</h1>

          <form v-on:submit.prevent="login()">

            <div class="field">

              <label class="label">Email:</label>

              <input v-model="data.body.email" type="text" class="input" />

            </div>

            <div class="field">

              <label class="label">Password:</label>

              <input v-model="data.body.password" class="input" type="password" />

            </div>

            <div class="field">

              <input v-model="data.rememberMe" type="checkbox" />
              <label class="label">Remember Me</label>

            </div>

            <div class="field">

              <div class="control">

                <button class="button is-success" type="submit">Login</button>

              </div>

            </div>

            <div v-show="error" style="color:red; word-wrap:break-word;">{{ error }}</div>

          </form>

        </div>

      </div>

    </div>

  </section>

</template>

<script>
export default {
  data() {
    return {
      context: 'login context',
      data: {
        body: {
          email: '',
          password: ''
        },
        rememberMe: false,
        fetchUser: false
      },
      error: null
    }
  },
  mounted() {
    // Can set query parameter here for auth redirect or just do it silently in login redirect.
  },
  methods: {
    login() {
      let redirect = this.$auth.redirect()
      console.log('redirect to: ')
      console.log(redirect)
      console.log(this.data.body)
      this.$auth
        .login({
          data: this.data.body,
          rememberMe: true,
          redirect: { name: redirect ? redirect.from.name : 'Index' },
          fetchUser: false
        })
        .then(null, (res) => {
          console.log(res)
          this.errors(res.response)
        })
    }
  }
}
</script>

