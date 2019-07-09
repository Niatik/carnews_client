<template>
    <v-container>
        <v-alert
                v-model="alert"
                dismissible
                type="error"
        >{{ error }}
        </v-alert>
        <v-card>
            <v-card-title>
                {{ cardLabel }}
                <span class="circle">{{ size }}</span>
                <v-spacer></v-spacer>
                <v-text-field
                        append-icon="search"
                        label="Поиск"
                        single-line
                        hide-details
                        v-model="search"
                ></v-text-field>
            </v-card-title>
            <v-layout v-resize="onResize" column>
                <v-data-table
                        :headers="headers"
                        :items="items"
                        :search="search"
                        :hide-headers="isMobile"
                        :class="{mobile: isMobile}"
                        rows-per-page-text="строк"
                        :rows-per-page-items="[10, 25, 50]"
                >
                    <template slot="items" slot-scope="props">
                        <tr :class="{scammer: props.item.scammer_id > 0}" @click="viewItem(props.item)" v-if="!isMobile">
                            <td>{{ props.item.group.name }}</td>
                            <td>{{ props.item.message }}</td>
                            <td class="purple--text">{{ props.item.created_at }}</td>
                            <td class="justify-center layout px-0">
                                <v-btn icon class="mx-0" @click.stop="viewItem(props.item)">
                                    <v-icon color="teal">view_compact</v-icon>
                                </v-btn>
                                <v-btn icon class="mx-0" @click.stop="favoriteItem(props.item)">
                                    <v-icon color="red">stars</v-icon>
                                </v-btn>
                            </td>
                        </tr>
                        <tr :class="{scammer: props.item.scammer_id > 0}" @click="viewItem(props.item)" v-else>
                            <td class="flex-content column">
                                <ul class="flex-content">
                                    <li class="flex-item" data-label="Группа">{{ props.item.group.name }}</li>
                                    <li class="flex-item" data-label="Сообщение">{{ props.item.message }}</li>
                                    <li class="flex-item red--text" data-label="Создано">{{ props.item.created_at }}</li>
                                </ul>
                                <div class="justify-center layout px-0">
                                    <v-btn icon class="mx-0" @click.stop="viewItem(props.item)">
                                        <v-icon color="teal">view_compact</v-icon>
                                    </v-btn>
                                    <v-btn icon class="mx-0" @click.stop="favoriteItem(props.item)">
                                        <v-icon color="red">stars</v-icon>
                                    </v-btn>
                                </div>
                            </td>
                        </tr>
                    </template>
                    <template slot="no-data">
                        <v-btn color="primary" @click="initialize">Перезагрузить</v-btn>
                    </template>
                    <v-alert slot="no-results" :value="true" color="error" icon="warning">
                        Ваш поиск по "{{ search }}" не дал результатов.
                    </v-alert>
                    <template v-slot:footer>
                        <td :colspan="headers.length">
                            <strong></strong>
                        </td>
                    </template>
                </v-data-table>
            </v-layout>
        </v-card>
    </v-container>
</template>

<script>
  import axios from 'axios';

  function Post({ id, group_id, from_id, message, group, scammer_id, created_at}) {
    this.id = id
    this.group_id = group_id
    this.from_id = from_id
    this.message = message
    this.group = group
    this.scammer_id = scammer_id
    this.created_at = created_at
  }
  export default {
    name: 'PostView',
    data: () => ({
      alert: false,
      error: '',
      search: '',
      cardLabel: 'Посты',
      isMobile: false,
      favorites: false,
      category_id: 0,
      title: '',
      headers: [
        {
          text: 'Группа',
          align: 'left',
          sortable: true,
          value: 'group'
        },
        {
          text: 'Сообщение',
          align: 'left',
          sortable: false,
          value: 'message'
        },
        {
          text: 'Создано',
          align: 'left',
          sortable: false,
          value: 'created_at'
        }
      ],
      items: [],
      size: 0
    }),
    metaInfo() {
      return {
        title: (this.favorites ? 'Избранное' : this.title)
      }
    },
    beforeRouteEnter (to, from, next) {
      next(vm => {
        vm.favorites = 'favorites' === (vm.$route.name);
        vm.items = []
        vm.initialize()
      })
    },
    methods: {
      initialize () {
        this.category_id = this.$route.params.category_id
        if (this.favorites) {
          axios.get(`/client/favorites`).then(({data}) => {
            data.data.forEach(post => {
              this.items.push(new Post(post));
            });
            this.size = this.items.length
            this.cardLabel = "Избранное"
          });
          this.$store.dispatch('changeTitle', 'Избранное')
        } else {
          axios.get(`/client/posts?category=${this.category_id }`).then(({data}) => {
            data.data.forEach(post => {
              this.items.push(new Post(post));
            });
            this.size = this.items.length
          });
          axios.get(`/categories/${this.category_id}`).then(({data}) => {
            this.title = data.data.name
            this.$store.dispatch('changeTitle', this.title)
          });
        }
      },
      onResize() {
        if (window.innerWidth < 769)
          this.isMobile = true;
        else
          this.isMobile = false;
      },
      viewItem (item) {
        if (this.favorites) {
          this.$router.push({path: `/favorites/${item.id}`})
        } else {
          this.$router.push({path: `/categories/${this.category_id}/posts/${item.id}`})
        }
      },
      favoriteItem (item) {
        const index = this.items.indexOf(item)
        if (!this.favorites) {
          axios.post(`/client/posts/${item.id}/favorite`).then(() => {
            this.items.splice(index, 1);
          }).catch(error => {
            this.error = error.toString()
            this.alert = true
          })
        } else {
          axios.post(`/client/posts/${item.id}/unfavorite`).then(() => {
            this.items.splice(index, 1);
          }).catch(error => {
            this.error = error.toString()
            this.alert = true
          })
        }
      },
      isScammer (item) {
        return item.scammer_id > 0;
      },
    }
  }
</script>

<style>
    .circle {
        padding: 5px 7px;
        margin-left: 5px;
        color: #f8fafc;
        background: #6574cd;
        border-radius: 22px;
    }

    .scammer {
        border-left: 6px solid red;
    }

    @media screen and (max-width: 768px) {
        .mobile table.v-table tr {
            max-width: 100%;
            position: relative;
            display: block;
        }

        .mobile table.v-table tr:nth-child(odd) {
            border-left: 6px solid deeppink;
        }

        .mobile table.v-table tr:nth-child(even) {
            border-left: 6px solid cyan;
        }

        .scammer {
            border-left: 6px solid red !important;
        }

        .mobile table.v-table tr td {
            display: flex;
            width: 100%;
            border-bottom: 1px solid #f5f5f5;
            height: auto;
            padding: 10px;
        }

        .mobile table.v-table tr td ul li:before {
            content: attr(data-label);
            padding-right: .5em;
            text-align: left;
            display: block;
            color: #999;

        }
        .v-datatable__actions__select
        {
            width: 50%;
            margin: 0px;
            justify-content: flex-start;
        }
        .mobile .theme--light.v-table tbody tr:hover:not(.v-datatable__expand-row) {
            background: transparent;
        }
    }
    .flex-content {
        padding: 0;
        margin: 0;
        list-style: none;
        display: flex;
        flex-wrap: wrap;
        width: 100%;
    }

    .flex-item {
        padding: 5px;
        width: 50%;
        /*height: 40px;*/
        font-weight: bold;
    }
</style>