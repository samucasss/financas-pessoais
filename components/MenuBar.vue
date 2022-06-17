<template>
  <div>
    <b-navbar toggleable="lg" type="dark" variant="info">
      <b-navbar-brand href="/">{{ appName }}</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item
            v-for="menu of menuList"
            :key="menu.nome"
            :href="menu.link"
            >{{ menu.nome }}</b-nav-item
          >
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-form>
            <b-form-input
              v-model="search"
              size="sm"
              class="mr-sm-2"
              placeholder="Pesquisar"
            ></b-form-input>
            <b-button
              size="sm"
              class="my-2 my-sm-0"
              type="button"
              @click="pesquisar()"
              >OK</b-button
            >
          </b-nav-form>

          <b-nav-item-dropdown right>
            <!-- Using 'button-content' slot -->
            <template #button-content>
              <em>{{ userName }}</em>
            </template>
            <b-dropdown-item href="#">Sair</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
export default {
  props: {
    appName: {
      type: String,
      default: ''
    },
    userName: {
      type: String,
      default: ''
    },
    menuList: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      search: ''
    }
  },
  methods: {
    pesquisar () {
      this.$router.push({
        path: '/tarefas/TarefaList',
        query: {
          search: this.search
        }
      })
    }
  }
}
</script>
