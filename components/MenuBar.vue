<template>
  <div>
    <b-navbar toggleable="lg" type="dark" variant="info">
      <b-navbar-brand href="/">{{ appName }}</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav v-if="isAuthenticated">
          <b-nav-item
            v-for="menu of menuList"
            :key="menu.nome"
            :href="menu.link"
            >{{ menu.nome }}</b-nav-item
          >
        </b-navbar-nav>

        <b-navbar-nav v-if="!isAuthenticated" class="ml-auto">
          <b-nav-item right href="/usuarios/RegistroForm">Registre-se</b-nav-item>
          <b-nav-item right href="/login">Login</b-nav-item>
        </b-navbar-nav>

        <b-navbar-nav v-if="isAuthenticated" class="ml-auto">
          <b-nav-item-dropdown right>
            <template #button-content>
              <em>{{ loggedInUser.nome }}</em>
            </template>
            <b-dropdown-item href="/usuarios/AlterarForm">Meus dados</b-dropdown-item>
            <b-dropdown-item @click="logout">Sair</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  props: {
    appName: {
      type: String,
      default: "",
    },
    userName: {
      type: String,
      default: "",
    },
    menuList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["isAuthenticated", "loggedInUser"]),
  },
  methods: {
    async logout() {
      await this.$auth.logout();
    },
  },
};
</script>
