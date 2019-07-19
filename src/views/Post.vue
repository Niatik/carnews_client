<template>
    <v-container fluid>
        <v-alert
                v-model="alert_error"
                dismissible
                type="error"
        >{{ error }}
        </v-alert>
        <v-alert
                v-model="alert_success"
                dismissible
                type="success"
        >{{ success }}
        </v-alert>

        <v-layout row wrap>
            <v-flex xs12 sm6 offset-sm3>
                <v-card min-width="300">
                    <v-card-title primary-title>
                        <div>
                            <h3 class="headline mb-2">Категория: {{ category_name }}</h3>
                        </div>
                    </v-card-title>
                    <v-card-text class="pt-2">
                        <p class="mb-4"> {{ message }}</p>
                        <div>
                            <span>Профиль: </span><a :href ="from_link" class="mb-2" target="_blank">{{ from_link }}</a>
                        </div>
                        <div>
                            <span>Запись: </span><a :href ="wall_link" class="mb-2" target="_blank">{{ wall_link}}</a>
                        </div>
                        <div class="mt-4">
                            <span class="purple--text">Создано: {{ created_at}}</span>
                        </div>
                    </v-card-text>

                    <v-card>
                        <v-container fluid grid-list-md>
                            <v-layout row wrap>
                                <v-flex v-for="card in cards" :key="card.id" v-bind="{ [`xs${card.flex}`]: true }">
                                    <v-card>
                                        <v-img :src="card.src" height="250px" contain>
                                            <v-container fill-height fluid pa-2></v-container>
                                        </v-img>
                                    </v-card>
                                </v-flex>
                            </v-layout>
                        </v-container>
                    </v-card>

                    <v-card-actions class="actions">
                        <div>
                            <v-btn class="action" color="orange" @click="favoritePost">В Избранное</v-btn>
                        </div>
                        <div>
                            <v-btn class="action" color="red" @click="deletePost">Удалить</v-btn>
                        </div>
                        <div>
                            <v-btn class="action" color="primary" @click="backToPosts">назад</v-btn>
                        </div>
                    </v-card-actions>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
  import axios from 'axios'

  function Card({id, src, flex}) {
    this.id = id
    this.src=src
    this.flex=flex
  }

  export default {
    name: 'Post',
    metaInfo: {
      title: 'Пост'
    },
    data: () => ({
      alert_error: false,
      alert_success: false,
      error: '',
      success: '',
      id: '',
      group_name: '',
      category_name: '',
      country_name: '',
      category_id: 0,
      message: '',
      from_id: '',
      photos: [],
      favorite: false,
      wall_link: '',
      created_at: '',
    }),
    created () {
      this.initialize()
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.favorite = 'favorite' === (vm.$route.name);
      })
    },
    methods: {
      initialize () {
        this.id = this.$route.params.post_id
        this.category_id = this.$route.params.category_id
        axios.get(`/client/posts/${this.id }`).then(({ data }) => {
          this.group_name = data.data.group.name
          this.country_name = data.data.group.country.name
          this.message = data.data.message
          this.photos = data.data.photos
          this.from_id = data.data.from_id
          this.wall_link = data.meta.link
          this.created_at = data.data.created_at
        }).catch((error) => {
          this.error = error.toString()
          this.alert_error = true
        });
        axios.get(`/categories/${this.category_id}`).then(({data}) => {
          this.category_name = data.data.name
        });

        this.$store.dispatch('changeTitle', 'Пост')
      },
      favoritePost () {
        if (!this.favorite) {
          axios.post(`/client/posts/${this.id}/favorite`).then(() => {
            this.alert_success = true
            this.$router.push({path: `/categories/${this.category_id}/posts`})
          }).catch(error => {
            this.error = error.toString()
            this.alert_error = true
          })
        } else {
          axios.post(`/client/posts/${this.id}/unfavorite`).then(() => {
            this.alert_success = true
            this.$router.push({path: `/favorites`})
          }).catch(error => {
            this.error = error.toString()
            this.alert_error = true
          })
        }
      },
      backToPosts() {
        if (!this.favorite) {
          this.$router.push({path: `/categories/${this.category_id}/posts`})
        } else {
          this.$router.push({path: `/favorites`})
        }
      },
      deletePost() {
        axios.post(`/client/posts/${this.id}/delete`).then(() => {
          this.alert_success = true
          this.$router.push({path: `/categories/${this.category_id}/posts`})
        }).catch(error => {
          this.error = error.toString()
          this.alert_error = true
        })
      }
    },
    computed: {
      cards: function () {
        let cards = []
        let id = 1
        let flex = 6
        this.photos.forEach(card => {
          let src = this.$store.state.pathToApiSite + '/storage/' + card
          cards.push(new Card({id: id, src: src, flex: flex}))
          id++;
        })
        return cards
      },
      from_link: function() {
        return 'http://vk.com/id' + this.from_id;
      }
    }
  }
</script>

<style scoped>
    .action {
        margin: 5px 5px;
    }
    @media only screen and (max-width: 600px) {
        .container {
            padding: 0;
        }
        .actions {
            display: block;
            text-align: center;
        }
        .action {
            margin-top: 5px;
            width: 100%
        }
    }
</style>