<template>
  <UsuarioForm :usuario="usuario" title="Novo Registro"/>
</template>

<script>
import UsuarioForm from './UsuarioForm'
import { Usuario } from "~/models/Usuario";

export default {
  name: "RegistroForm",
  components: {
      UsuarioForm
  },
  data() {
    return {
      usuario: new Usuario(),
    };
  },
};
</script>