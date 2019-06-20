<template>
    <v-container fluid>
        <v-layout row wrap>
            <v-flex>
                <v-alert type="error" dismissible v-model="error">
                    {{ errors }}
                </v-alert>
            </v-flex>
            <v-flex xs12 class="text-xs-center" mt-5>
                <h1>Регистрация</h1>
            </v-flex>
            <v-flex xs12 sm6 offset-sm3 mt-3>
                <form @submit.prevent="register">
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
                                    name="name"
                                    label="Имя"
                                    id="name"
                                    type="text"
                                    v-model="name"
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
                        <v-flex>
                            <v-text-field
                                    name="password_confirmation"
                                    label="Подтверждение пароля"
                                    id="password_confirmation"
                                    type="password"
                                    v-model="password_confirmation"
                                    :rules="[comparePasswords]"
                                    required>
                            </v-text-field>
                        </v-flex>
                        <v-flex class="text-xs-center" mt-5>
                            <v-btn dusk="register-button" color="primary" type="submit" :disabled="loading">Зарегистрироваться</v-btn>
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
      title: 'Регистрация'
    },
    data(){
      return {
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
      };
    },
    created () {
      this.$store.dispatch('changeTitle', 'Регистрация')
    },
    methods: {
      register(){
        this.$store.dispatch('userRegister',  { auth: this.$auth, email: this.email, name: this.name, password: this.password, password_confirmation: this.password_confirmation })
      }
    },
    computed: {
      comparePasswords() {
        return this.password === this.password_confirmation ? true : 'Passwords don\'t match'
      },
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