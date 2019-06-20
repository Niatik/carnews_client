<template>
    <v-container fluid>
        <v-layout row wrap>
            <v-flex>
                <v-alert type="error" dismissible v-model="error">
                    {{ errors }}
                </v-alert>
            </v-flex>
            <v-flex xs12 class="text-xs-center" mt-5>
                <h1>Вход</h1>
            </v-flex>
            <v-flex xs12 sm6 offset-sm3 mt-3>
                <form @submit.prevent="login">
                    <v-layout column>
                        <v-flex>
                            <v-text-field
                                    name="email"
                                    label="Email"
                                    id="email"
                                    type="email"
                                    v-model="email"
                                    required>
                            </v-text-field>
                        </v-flex>
                        <v-flex>
                            <v-text-field
                                    name="password"
                                    label="Пароль"
                                    id="password"
                                    type="password"
                                    v-model="password"
                                    required>
                            </v-text-field>
                        </v-flex>
                        <v-flex class="text-xs-center" mt-5>
                            <v-btn dusk="login-button" color="primary" type="submit" :disabled="loading">Войти</v-btn>
                        </v-flex>
                    </v-layout>
                </form>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
  export default {
    metaInfo: {
      title: 'Вход'
    },
    data(){
      return {
        email: '',
        password: '',
      };
    },
    created () {
      this.$store.dispatch('changeTitle', 'Вход')
    },
    methods: {
      login(){
        this.$store.dispatch('userLogin', {auth: this.$auth, email: this.email, password: this.password })
      }
    },
    computed: {
      error () {
        return this.$store.state.error
      },
      errors () {
        return this.$store.state.errors
      },
      loading () {
        return this.$store.state.loading
      }
    }
  }
</script>

<style scoped>

</style>