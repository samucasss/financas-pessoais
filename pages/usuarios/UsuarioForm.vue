<template>
  <div>
    <b-breadcrumb :items="breadcrumbList"></b-breadcrumb>

    <b-alert
      :variant="optionsAlert.variant"
      :show="optionsAlert.timer"
      dismissible
      @dismissed="optionsAlert.timer = 0"
    >
      {{ optionsAlert.message }}
    </b-alert>

    <b-form>
      <b-col cols="4">
        <b-form-group label="Nome:" label-for="nome">
          <b-form-input
            id="nome"
            v-model="usuarioEdit.nome"
            type="text"
            required
            placeholder="Informe o nome do usuário"
          >
          </b-form-input>
        </b-form-group>

        <b-form-group label="E-mail:" label-for="email">
          <b-form-input
            id="email"
            v-model="usuarioEdit.email"
            type="email"
            required
            placeholder="Informe o e-mail do usuário"
          >
          </b-form-input>
        </b-form-group>

        <b-form-group label="Senha:" label-for="senha">
          <b-form-input
            id="senha"
            v-model="usuarioEdit.senha"
            type="password"
            required
            placeholder="Informe a senha do usuário"
          >
          </b-form-input>
        </b-form-group>

        <b-form-group>
          <b-button type="button" :variant="buttonOk.variant" @click="save()">{{
            buttonOk.label
          }}</b-button>
          <b-button v-if="usuario.id" type="button" @click="remove()"
            >Excluir meu registro</b-button
          >
        </b-form-group>
      </b-col>
    </b-form>
  </div>
</template>

<script>
import { Usuario } from "@/models/Usuario";

export default {
  name: "UsuarioForm",
  props: {
    usuario: Usuario,
    title: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      usuarioEdit: new Usuario(),
      breadcrumbList: [this.title],
      optionsAlert: {
        message: "",
        variant: "success",
        timer: 0,
      },
      buttonOk: {
        label: "OK",
        variant: "primary",
      },
    };
  },
  beforeMount() {
    Object.assign(this.usuarioEdit, this.usuario);
  },
  methods: {
    success() {
      this.optionsAlert = {
        message: "Operação realizada com sucesso",
        variant: "success",
        timer: 5,
      };
    },
    error(msg) {
      this.optionsAlert = { message: msg, variant: "danger", timer: 5 };
    },
    validate() {
      if (!this.usuarioEdit.nome) {
        this.error("Favor informar o campo Nome");
        return false;
      }

      if (!this.usuarioEdit.email) {
        this.error("Favor informar o campo E-mail");
        return false;
      }

      const pattern = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
      if (!pattern.test(this.usuarioEdit.email)) {
        this.error("E-mail inválido");
        return false;
      }

      if (!this.usuarioEdit.senha) {
        this.error("Favor informar o campo Senha");
        return false;
      }

      return true;
    },
    async save() {
      if (!this.validate()) {
        return false;
      }

      this.buttonOk = { label: "Aguarde ...", variant: "warning" };

      try {
        // registra o usuario
        await this.$axios.post("/api/usuarios", this.usuarioEdit);
        this.success();

        // loga o usuario caso nao seja edicao
        if (!this.usuario.id) {
          await this.$auth.loginWith("local", {
            data: {
              email: this.usuarioEdit.email,
              senha: this.usuarioEdit.senha,
            },
          });
        }

      } catch (e) {
        this.error("Erro ao salvar usuario");
      }

      this.buttonOk = { label: "OK", variant: "primary" };
    },
    remove() {
      this.$bvModal
        .msgBoxConfirm("Tem certeza que deseja excluir seu registro?")
        .then((value) => {
          if (value) {
            this.removeUsuario();
          }
        })
        .catch((err) => {
          window.console.log("Erro na confirmacao: " + err);
        });
    },
    async removeUsuario() {
      try {
        await this.$axios.delete("/api/usuario/");
        this.success();

        await this.$auth.logout();
      } catch (e) {
        this.error("Erro ao remover usuario");
      }
    },
  },
};
</script>