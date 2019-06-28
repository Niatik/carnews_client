<template>
    <v-container>
        <v-alert
                v-model="alert"
                dismissible
                type="error"
        >{{ error }}
        </v-alert>

        <v-btn color="primary" dark slot="activator" class="mb-2" @click.stop="createSubscription">
            Оформить подписку
        </v-btn>
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
                        <tr @click="viewSubscription(props.item)" v-if="!isMobile">
                            <td>{{ props.item.begin_date }}</td>
                            <td>{{ props.item.end_date }}</td>
                            <td>{{ props.item.amount.toFixed(2) }}</td>
                            <td>
                                <v-checkbox hide-details v-model="props.item.paid" disabled class="align-center justify-center">
                                </v-checkbox>
                            </td>
                        </tr>
                        <tr @click="viewSubscription(props.item)" v-else>
                            <td class="flex-content column">
                                <ul class="flex-content">
                                    <li class="flex-item" data-label="Дата начала">{{ props.item.begin_date }}</li>
                                    <li class="flex-item" data-label="Дата окончания">{{ props.item.end_date }}</li>
                                    <li class="flex-item" data-label="Сумма">{{ props.item.amount.toFixed(2) }}</li>
                                    <li class="flex-item" data-label="Оплачена">
                                        <v-checkbox v-model="props.item.paid" disabled></v-checkbox>
                                    </li>
                                </ul>
                                <div class="justify-center layout px-0">
                                    <v-btn icon class="mx-0" @click.stop="viewSubscription(props.item)">
                                        <v-icon color="blue">class</v-icon>
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

  function Subscription({ id, begin_date, end_date, amount, paid}) {
    this.id = id
    this.begin_date = begin_date
    this.end_date = end_date
    this.amount = amount
    this.paid = paid
  }

  export default {
    name: 'SubscriptionsView',
    metaInfo: {
      title: 'Подписки'
    },
    data: () => ({
      alert: false,
      error: '',
      search: '',
      cardLabel: 'История подписок',
      headers: [
        {
          text: 'Дата начала',
          align: 'left',
          sortable: true,
          value: 'begin_date'
        },
        {
          text: 'Дата окончания',
          align: 'left',
          sortable: true,
          value: 'end_date'
        },
        {
          text: 'Сумма',
          align: 'left',
          sortable: true,
          value: 'amount'
        },
        {
          text: 'Оплачена',
          align: 'left',
          sortable: true,
          value: 'paid'
        },
      ],
      items: [],
      editedIndex: -1,
      editedItem: {
        begin_date: '',
        end_date: '',
        amount: '',
        paid: ''
      },
      defaultItem: {
        begin_date: '',
        end_date: '',
        amount: '',
        paid: ''
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
        axios.get('/client/subscriptions').then(({ data }) => {
          data.data.forEach(subscription => {
            this.items.push(new Subscription(subscription));
          });
        });
        this.$store.dispatch('changeTitle', 'Подписки')
      },
      onResize() {
        if (window.innerWidth < 769) {
          this.isMobile = true
        } else this.isMobile = false;
      },
      viewSubscription(item) {
        this.$router.push({path: `/subscriptions/${item.id}`})
      },
      createSubscription() {
        this.$router.push({path: `/subscriptions/create`})
      }
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