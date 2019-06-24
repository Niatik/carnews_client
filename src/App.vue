<template>
  <v-app>
    <v-navigation-drawer v-model="sidebar" app>
      <v-list>
        <v-list-tile
                v-for="item in menuItems"
                :key="item.title"
                :to="item.path">
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            {{ item.title }}
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile class="logout-button-side" v-if="$auth.check()" @click="logout">
          <v-list-tile-action>
            <v-icon>exit_to_app</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>Выйти</v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>

    <v-toolbar app>
      <v-toolbar-side-icon @click="sidebar = !sidebar">
      </v-toolbar-side-icon>
      <router-link class="app-title" v-if='!$auth.check()' router-link to="/" tag="span" style="cursor: pointer">
        {{ appTitle }}
      </router-link>
      <router-link class="app-title" v-if='$auth.check()' router-link to="/home" tag="span" style="cursor: pointer">
        {{ appTitle }}
      </router-link>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-xs-only">
        <v-btn
                flat
                v-for="item in menuItems"
                :key="item.title"
                :to="item.path">
          <v-icon left dark>{{ item.icon }}</v-icon>
          {{ item.title }}
        </v-btn>
        <v-btn class="logout-button" v-if="$auth.check()" flat @click="logout">
          <v-icon left>exit_to_app</v-icon>
          Выйти
        </v-btn>
      </v-toolbar-items>

    </v-toolbar>

    <v-content>
      <div v-if="$auth.ready()">
        <transition name="fade" mode="out-in">
          <router-view></router-view>
        </transition>
      </div>

      <div class="is-loading" v-if="!$auth.ready()">
        Загрузка ...
      </div>
    </v-content>

  </v-app>
</template>

<script>
  export default {
    data () {
      return {
        sidebar: false,
      }
    },
    methods: {
      logout () {
        this.$store.dispatch('userLogout', {auth: this.$auth})
      }
    },
    computed: {
      menuItems () {
        if (this.$auth.check()) {
          return [
            { title: 'Главная', path: '/', icon: 'home' },
            { title: 'Избранное', path: '/favorites'},
            { title: 'Подписки', path: '/subscriptions'}
          ]
        } else {
          return [
            { title: 'Зарегистрироваться', path: '/register', icon: 'face' },
            { title: 'Войти', path: '/login', icon: 'lock_open' }
          ]
        }
      },
      appTitle () {
        return this.$store.state.appTitle
      }
    }
  }
</script>

<style scoped>
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s ease-out;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
</style>