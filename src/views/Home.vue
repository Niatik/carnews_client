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
                        :hide-headers="isMobile"
                        :class="{mobile: isMobile}"
                        hide-actions=""
                        :search="search"
                >
                    <template slot="items" slot-scope="props">
                        <tr @click="viewPosts(props.item)" v-if="!isMobile">
                            <td>{{ props.item.name }}</td>
                            <td>{{ props.item.price }}</td>
                            <td class="justify-center layout px-0">
                                <v-btn icon class="mx-0" @click.stop="viewPosts(props.item)">
                                    <v-icon color="blue">view_list</v-icon>
                                </v-btn>
                            </td>
                        </tr>
                        <tr @click="viewPosts(props.item)" v-else>
                            <td class="flex-content column">
                                <ul class="flex-content">
                                    <li class="flex-item" data-label="Категория">{{ props.item.name }}</li>
                                    <li class="flex-item" data-label="Тариф">{{ props.item.price }}</li>
                                </ul>
                                <div class="justify-center layout px-0">
                                    <v-btn icon class="mx-0" @click.stop="viewPosts(props.item)">
                                        <v-icon color="blue">view_list</v-icon>
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

  function Category({ id, name, price}) {
    this.id = id
    this.name = name
    this.price = price
  }

  export default {
    name: 'HomeView',
    metaInfo: {
      title: 'Главная страница'
    },
    data: () => ({
      alert: false,
      error: '',
      search: '',
      dialog: false,
      cardLabel: 'Справочник категорий',
      headers: [
        {
          text: 'Название категории',
          align: 'left',
          sortable: true,
          value: 'name'
        },
        {
          text: 'Тариф',
          align: 'left',
          sortable: true,
          value: 'price'
        },
      ],
      items: [],
      defaultItem: {
        name: '',
        price: '',
        keywords: ''
      },
      isMobile: false
    }),
    computed: {
      formTitle () {
        return this.editedIndex === -1 ? this.addLabel : this.editLabel
      }
    },
    created () {
      this.initialize()
    },
    methods: {
      initialize () {
        axios.get('/client/categories').then(({ data }) => {
          data.data.forEach(category => {
            this.items.push(new Category(category));
          });
        }).catch((error) => {
          this.$router.push({path: `/subscriptions/create`})
          this.error = error.toString()
        });
        this.$store.dispatch('changeTitle', 'Категории')
      },
      onResize() {
        if (window.innerWidth < 769) {
          this.isMobile = true
        } else this.isMobile = false;
      },
      viewPosts(item) {
        this.$router.push({ path: `/categories/${item.id}/posts` })
      },
    }
  }
</script>

<style scoped>
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

        .v-datatable__actions__select {
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