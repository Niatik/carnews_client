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
        <v-card>
            <v-card-title>
                Оформление подписки
                <v-spacer></v-spacer>
                <v-text-field
                        append-icon="search"
                        label="Поиск"
                        single-line
                        hide-details
                        v-model="search"
                ></v-text-field>
            </v-card-title>
        </v-card>
        <v-form>
            <v-layout v-resize="onResize" column>
                <v-data-table
                        v-model="selected"
                        :headers="headers"
                        :items="items"
                        item-key="name"
                        :hide-headers="isMobile"
                        :class="{mobile: isMobile}"
                        hide-actions=""
                        select-all
                        :search="search"
                >
                    <template slot="items" slot-scope="props">
                        <tr v-if="!isMobile && props.item.id > 1">
                            <td>
                                <v-checkbox v-model="props.selected" primary hide-details></v-checkbox>
                            </td>
                            <td>{{ props.item.name }}</td>
                            <td>{{ props.item.price }}</td>
                        </tr>
                        <tr v-else-if="isMobile && props.item.id > 1">
                            <td class="flex-content column">
                                <ul class="flex-content">
                                    <li class="flex-item" data-label="">
                                        <v-checkbox v-model="props.selected" primary hide-details></v-checkbox>
                                    </li>
                                    <li class="flex-item" data-label="Категория">{{ props.item.name }}</li>
                                    <li class="flex-item" data-label="Тариф">{{ props.item.price }}</li>
                                </ul>
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
                <v-btn color="primary" :disabled="ready" @click="subscribe" v-if="!subscription">Подписаться</v-btn>
            </v-layout>
        </v-form>
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
    name: 'SubscriptionForm',
    metaInfo: {
      title: 'Подписки'
    },
    data: () => ({
      alert_success: false,
      alert_error: false,
      subscription: false,
      error: '',
      success: '',
      search: '',
      isMobile: false,
      items: [],
      selected: [],
      amount: 0,
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
    }),
    created () {
      this.initialize()
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.subscription = 'subscription' === (vm.$route.name);
      })
    },
    methods: {
      initialize () {
        axios.get('/categories').then(({ data }) => {
          data.data.forEach(category => {
            this.items.push(new Category(category));
          });
        });
        this.$store.dispatch('changeTitle', 'Оформление подписки')
      },
      onResize() {
        if (window.innerWidth < 769) {
          this.isMobile = true
        } else this.isMobile = false;
      },
      subscribe () {
        let amount = 0
        this.selected.forEach(function(item) {
          amount = amount + Number(item.price)
        })
        this.amount = amount.toFixed(2);
        axios.post(`/client/subscriptions`, {amount: this.amount, categories: this.selected }).then(response => {
          let r = response.data.data;
          this.success = "подписка на сумму " + r.amount + " создана. Пожалуйста ждите одобрения!"
          this.alert_success = true
        }).catch(error => {
          this.error = error.toString()
          this.alert_error = true
        })
      },
    },
    computed: {
      ready () {
        return !this.selected.length > 0
      }
    }
  }
</script>

<style scoped>

</style>