<template>
  <section class="section">
    <div class="columns" v-if="!loading">
      <div class="column">
        <form @submit.prevent="submit_record">
          <div class="field">
            <label class="label">Blog:</label>
            <div class="select">
              <select class="select" v-model="record.attributes.blog_id">
                <option value="1">LP</option>
                <option value="2">CD</option>
                <option value="3">7"</option>
              </select>
            </div>
          </div>
          <div class="field">
            <label class="label">Artist(s):</label>
            <multiselect
              v-model="artistSelected"
              :taggable="true"
              :multiple="true"
              track-by="id"
              label="name"
              @tag="addArtist"
              :options="artistOptions"
            />
          </div>
          <div class="field">
            <label class="label">Title:</label>
            <input class="input" v-model="record.attributes.title" />
          </div>
          <div class="field">
            <label class="label">Display name:</label>
            <input class="input" v-model="record.attributes.display_name" />
          </div>
          <div class="field">
            <label class="label">Label(s):</label>
            <multiselect
              v-model="labelSelected"
              :taggable="true"
              :multiple="true"
              track-by="id"
              label="name"
              @tag="addLabel"
              :options="labelOptions"
            />
          </div>
          <div class="field">
            <label class="label">Album cover:</label>
            <img
              v-if="record.attributes.image && record.attributes.image.length < 1000"
              :src="record.attributes.image"
            />
            <div class="file">
              <label class="file-label">
                <vue-base64-file-upload
                  class="v1"
                  v-model="record.attributes.image"
                  accept="image/png,image/jpeg"
                  image-class="v1-image"
                  input-class="v1-input"
                  :max-size="customImageMaxSize"
                />
              </label>
            </div>
          </div>
          <div class="field">
            <vue-editor v-model="record.attributes.review" />
          </div>
          <div class="field">
            <label class="label">Published?</label>
            <input type="checkbox" v-model="record.attributes.published" />
          </div>
          <div class="field">
            <label class="label">Published at:</label>
            <input class="input" v-model="record.attributes.published_at" />
          </div>
          <div class="field">
            <label class="label">Tags:</label>
            <multiselect
              v-model="tagSelected"
              :taggable="true"
              :multiple="true"
              track-by="name"
              label="name"
              @tag="addTag"
              :options="tags"
            />
          </div>
          <p v-if="errors.length > 0">{{ errors }} </p>
          <div class="field">
            <div class="control">
              <button v-if="!submitting" class="button is-link">Submit</button>
              <img v-else src="@/assets/loading.gif" />
            </div>
          </div>
        </form>
      </div>
    </div>
    <div v-else>
      <img src="@/assets/loading.gif" />
    </div>
  </section>
</template>
<script>
import VueBase64FileUpload from '@/components/Base64Upload.vue'
import { VueEditor } from 'vue3-editor'
import Multiselect from 'vue-multiselect'
export default {
  inject: ['axios'], 
  name: 'AlbumEditor',
  components: {
    VueBase64FileUpload,
    VueEditor,
    Multiselect
  },
  data() {
    return {
      customImageMaxSize: 15,
      errors: '',
      loading: true,
      artistSelected: [],
      artistOptions: [],
      tagSelected: [],
      labelSelected: [],
      tags: [],
      labelOptions: [],
      record: {
        attributes: {
          display_name: '',
          blog_id: 1,
          review: '',
          image: null,
          tag_list: '',
          published: false,
          published_at: null
        }
      },
      submitting: false
    }
  },
  methods: {
    addArtist(newArtist) {
      const artist = {
        name: newArtist,
        alphabetical_name: newArtist
      }
      this.axios.post('/artists', artist).then((resp) => {
        if (resp.status === 201) {
          console.log(resp.data.data.attributes)
          this.artistOptions.push(resp.data.data.attributes)
          this.artistSelected.push(resp.data.data.attributes)
        }
      })
    },
    addLabel(newLabel) {
      const label = {
        name: newLabel
      }
      this.axios.post('/labels', label).then((resp) => {
        if (resp.status === 201) {
          console.log(resp.data.data.attributes)
          this.labelOptions.push(resp.data.data.attributes)
          this.labelSelected.push(resp.data.data.attributes)
        }
      })
    },
    addTag(tag) {
      this.tagSelected.push({ name: tag })
    },
    submit_record() {
      this.submitting = true
      let payload = this.record.attributes
      //  POST or PUT depending on if new record. Default to POST
      let url = '/records'
      let method = 'post'
      if (this.$route.params.id) {
        url = '/records/' + this.record.id
        method = 'put'
      }
      payload.tag_list = this.tagSelected
        .map((t) => {
          return t.name
        })
        .join(',')
      payload.artists_attributes = this.artistSelected
      payload.labels_attributes = this.labelSelected

      this.axios({ url: url, method: method, data: payload })
        .then((resp) => {
          if (resp.status === 200 || resp.status === 201) {
            this.$router.push({ name: 'Album', params: { id: resp.data.data.attributes.slug, blogId: payload.blog_id } })
          }
        })
        .catch((err) => {
          this.errors = err
          this.submitting = false
          console.log(err)
        })
    }
  },
  computed: {},
  mounted() {
    this.axios.get('/tags').then((response) => {
      this.tags = response.data.data.map((e) => {
        return e.attributes
      })
    })
    this.axios.get('/artists').then((ar) => {
      this.artistOptions = ar.data.data.map((e) => {
        return e.attributes
      })
    })
    this.axios.get('/labels').then((lr) => {
      this.labelOptions = lr.data.data.map((e) => {
        return e.attributes
      })
    })
    if (this.$route.params.id) {
      this.axios.get('/records/' + this.$route.params.id).then((resp) => {
        console.log(resp.data)
        this.record = resp.data.data
        this.artistSelected = resp.data.included
          .filter((e) => {
            return e.type === 'artist'
          })
          .map((e) => {
            return e.attributes
          })
        this.labelSelected = resp.data.included
          .filter((e) => {
            return e.type === 'label'
          })
          .map((e) => {
            return e.attributes
          })
        this.tagSelected = resp.data.data.attributes.tag_list.map((t) => {
          return { name: t }
        })
        this.loading = false
      })
    } else {
      this.loading = false
    }
  }
}
</script>
<style src="vue-multiselect/dist/vue-multiselect.css"></style>
