<template>
  <UsuarioForm :usuario="usuario" title="Meus dados" />
</template>

<script>
import { mapGetters } from "vuex";
import UsuarioForm from './UsuarioForm'
import { Usuario } from "~/models/Usuario";

export default {
  name: "AlterarForm",
  components: {
      UsuarioForm
  },
  middleware: "auth",
  computed: {
    ...mapGetters(["isAuthenticated", "loggedInUser"]),
    usuario() {
      const usuario = new Usuario();
      Object.assign(usuario, this.loggedInUser);

      return usuario;
    },
  },
};
</script>