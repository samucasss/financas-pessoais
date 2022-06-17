<template>
  <div>
    <b-breadcrumb :items="breadcrumbList"></b-breadcrumb>

    <b-form>
      <b-form-group label="Data:" label-for="data">
        <b-form-datepicker
          id="data"
          v-model="eventoEdit.data"
          class="mb-2"
        ></b-form-datepicker>
      </b-form-group>

      <b-form-group label="Tipo:" label-for="tipo">
        <b-form-radio-group
          v-model="eventoEdit.tipo"
          :options="optionsTipo"
        ></b-form-radio-group>
      </b-form-group>

      <b-form-group label="Nome:" label-for="nome">
        <b-form-input
          id="nome"
          v-model="eventoEdit.nome"
          type="text"
          required
          placeholder="Informe o nome do evento"
        >
        </b-form-input>
      </b-form-group>

      <b-form-group>
        <b-row>
          <b-col cols="2">
            <b-form-checkbox v-model="eventoEdit.recorrente" @change="changeRealizado()">
              Recorrente?</b-form-checkbox
            >
          </b-col>
          <b-col cols="10">
            <b-form-radio-group
              v-if="eventoEdit.recorrente"
              v-model="eventoEdit.tipoRecorrencia"
              :options="optionsTipoRecorrencia"
            ></b-form-radio-group>
          </b-col>
        </b-row>
      </b-form-group>

      <b-form-group label="Valor:" label-for="valor">
        <money
          v-model="eventoEdit.valor"
          v-bind="money"
          class="form-control"
        ></money>
      </b-form-group>

      <b-form-group>
        <b-form-checkbox v-if="!eventoEdit.recorrente" v-model="eventoEdit.realizado">
          Realizado?</b-form-checkbox
        >
      </b-form-group>

      <b-form-group>
        <b-button type="button" :variant="buttonOk.variant" @click="save()">{{
          buttonOk.label
        }}</b-button>
        <b-button type="button" variant="secondary" @click="cancelar()"
          >Cancelar</b-button
        >
      </b-form-group>
    </b-form>
  </div>
</template>

<script>
import { Money } from "v-money";
import { Evento } from "@/models/Evento";
import { EventoManager } from "@/models/EventoManager";
import { Facade } from "@/services/Facade";

export default {
  name: "EventoForm",
  components: { Money },
  props: {
    eventoManager: EventoManager,
  },
  data() {
    return {
      service: Facade.getInstance(),
      eventoEdit: new Evento(),
      breadcrumbList: [
        { text: "Eventos", href: "#" },
        { text: "Novo", active: true },
      ],
      optionsTipo: [
        { value: "R", text: "Receita" },
        { value: "D", text: "Despesa" },
        { value: "I", text: "Investimento" },
      ],
      optionsTipoRecorrencia: [
        { value: "M", text: "Mensal" },
        { value: "A", text: "Anual" },
      ],
      money: {
        decimal: ",",
        thousands: ".",
        prefix: "R$ ",
        precision: 2,
        masked: false,
      },
      buttonOk: {
        label: "OK",
        variant: "primary",
      },
    };
  },
  beforeMount() {
    Object.assign(this.eventoEdit, this.eventoManager.modelAtual);
  },
  methods: {
    error(message) {
      this.$emit("error", message);
    },
    changeRealizado() {
      if (this.eventoEdit.recorrente) {
        this.eventoEdit.realizado = false
      }
    },
    validate() {
      if (!this.eventoEdit.data) {
        this.error("Favor informar o campo Data");
        return false;
      }

      if (!this.eventoEdit.tipo) {
        this.error("Favor informar o campo Tipo");
        return false;
      }

      if (!this.eventoEdit.nome) {
        this.error("Favor informar o campo Nome");
        return false;
      }

      if (this.eventoEdit.recorrente && !this.eventoEdit.tipoRecorrencia) {
        this.error("Favor informar o campo Tipo de recorrência");
        return false;
      }

      if (!this.eventoEdit.valor) {
        this.error("Favor informar o campo Valor");
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
        const json = await this.service.save(this.eventoEdit);

        if (this.eventoEdit.id) {
          this.eventoManager.update(json);
        } else {
          this.eventoManager.add(json);
        }

        this.$emit("success");
      } catch (e) {
        this.error("Erro ao salvar evento");
      }

      this.buttonOk = { label: "OK", variant: "primary" };

      this.cancelar();
    },
    cancelar() {
      this.eventoManager.reset();
    },
  },
};
</script>