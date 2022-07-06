<template>
  <main class="form-signin">
    <b-alert
      :variant="optionsAlert.variant"
      :show="optionsAlert.timer"
      dismissible
      @dismissed="optionsAlert.timer = 0"
    >
      {{ optionsAlert.message }}
    </b-alert>

    <div class="card">
      <div class="card-body">

        <form method="post" @submit.prevent="login">
          <h2 class="h3 mb-3 fw-normal text-center">Login</h2>

          <div class="form-group">
            <label>E-mail</label>
            <input
              v-model="email"
              type="email"
              class="form-control form-control-lg"
              placeholder="Endereço de e-mail"
            />
          </div>

          <div class="form-group">
            <label>Senha</label>
            <input
              v-model="senha"
              type="password"
              class="form-control form-control-lg"
              placeholder="Senha"
            />
          </div>

          <button class="w-100 btn btn-lg btn-primary" type="submit">OK</button>
        </form>
      </div>
    </div>
    <p class="mt-3 mb-3 text-muted text-center">By Samuel Santos</p>
  </main>
</template>

<script>
export default {
  name: "LoginPage",
  data() {
    return {
      email: "",
      senha: "",
      optionsAlert: {
        message: "",
        variant: "success",
        timer: 0,
      }
    };
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
      if (!this.email) {
        this.error("Favor informar o campo E-mail");
        return false;
      }

      const pattern = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
      if (!pattern.test(this.email)) {
        this.error("E-mail inválido");
        return false;
      }

      if (!this.senha) {
        this.error("Favor informar o campo Senha");
        return false;
      }

      return true;
    },
    async login() {
      if (!this.validate()) {
        return;
      }

      try {
        await this.$auth.loginWith("local", {
            data:  {
              email: this.email,
              senha: this.senha
            }
        });

        this.$router.push("/");

      } catch (e) {
        this.error('Erro: ' + e.response.data.msg);
      }
    },
  },
};
</script>

<style lang="css">
.form-signin {
  width: 40%;
  margin: auto;
}
label {
  font-weight: 600;
}
</style>