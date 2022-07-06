<template>
  <div>
    <b-breadcrumb :items="breadcrumbList"></b-breadcrumb>

    <span
      v-if="$fetchState.pending || showAguarde"
      style="color: red; float: right"
      >Aguarde ...</span
    >

    <b-alert
      :variant="optionsAlert.variant"
      :show="optionsAlert.timer"
      dismissible
      @dismissed="optionsAlert.timer = 0"
    >
      {{ optionsAlert.message }}
    </b-alert>

    <b-card header-tag="header">
      <template #header>
        <h6 class="mb-0">
          <month-picker-input
            lang="pt"
            :input-pre-filled="true"
            :default-month="mesAnoAtual.mes+1"
            :default-year="mesAnoAtual.ano"
            @change="changeMes"
          />
        </h6>
      </template>
      <b-card-text>
        <b-table-simple
          v-if="planejamentoMensal.planejamentoEventoList.length > 0"
          id="tablePlanejamentoMensal"
          hover
          small
          responsive
          bordered
        >
          <b-thead head-variant="dark">
            <b-tr>
              <b-th>Tipo</b-th>
              <b-th>Nome</b-th>
              <b-th style="width: 15%">Data</b-th>
              <b-th class="text-right" style="width: 15%">Valor</b-th>
              <b-th class="text-right" style="width: 10%">%</b-th>
              <b-th style="width: 5%">OK</b-th>
              <b-th style="width: 5%">Ações</b-th>
            </b-tr>
          </b-thead>
          <b-tbody>
            <b-tr
              v-for="planejamentoEvento of planejamentoEventoSortList"
              :key="planejamentoEvento.id"
            >
              <b-td>{{ planejamentoEvento.getTipoFormatado() }}</b-td>
              <b-td>{{ planejamentoEvento.nome }}</b-td>
              <b-td>
                <b-form-datepicker
                  v-model="planejamentoEvento.data"
                  :date-format-options="{
                    year: 'numeric',
                    month: 'numeric',
                    day: 'numeric',
                  }"
                  locale="pt-BR"
                ></b-form-datepicker>
              </b-td>
              <b-td class="text-right">
                <money
                  v-model="planejamentoEvento.valor"
                  v-bind="money"
                  class="form-control text-right"
                ></money>
              </b-td>
              <b-td></b-td>
              <b-td
                ><b-icon
                  v-if="planejamentoEvento.realizado"
                  icon="check"
                  variant="success"
                  font-scale="2"
                  aria-hidden="true"
                ></b-icon
              ></b-td>
              <b-td>
                <b-button
                  v-b-tooltip.hover
                  variant="outline-primary"
                  size="sm"
                  title="Realizar planejamento"
                  @click="save(planejamentoEvento)"
                >
                  <b-icon icon="check2" aria-hidden="true"></b-icon>
                </b-button>
                <span style="color: red; float: right">{{
                  planejamentoEvento.message
                }}</span>
              </b-td>
            </b-tr>
          </b-tbody>
          <b-tfoot>
            <b-tr>
              <b-th variant="secondary" colspan="3" class="text-right"
                >Total de receitas</b-th
              >
              <b-th variant="secondary" class="text-right">{{
                planejamentoMensal.getTotalReceitasFormatado()
              }}</b-th>
              <b-td variant="secondary" colspan="3"></b-td>
            </b-tr>
            <b-tr>
              <b-th variant="secondary" colspan="3" class="text-right"
                >Total de despesas fixas</b-th
              >
              <b-th variant="secondary" class="text-right">
                {{ planejamentoMensal.getTotalDespesasFixasFormatado() }}
              </b-th>
              <b-th variant="secondary" class="text-right">
                {{ planejamentoMensal.getPercentualDespesasFixasFormatado() }}
              </b-th>
              <b-td variant="secondary" colspan="2"></b-td>
            </b-tr>
            <b-tr>
              <b-th variant="secondary" colspan="3" class="text-right"
                >Total de despesas eventuais</b-th
              >
              <b-th variant="secondary" class="text-right">
                {{ planejamentoMensal.getTotalDespesasEventuaisFormatado() }}
              </b-th>
              <b-th variant="secondary" class="text-right">
                {{
                  planejamentoMensal.getPercentualDespesasEventuaisFormatado()
                }}
              </b-th>
              <b-td variant="secondary" colspan="2"></b-td>
            </b-tr>
            <b-tr>
              <b-th variant="secondary" colspan="3" class="text-right"
                >Total de investimentos</b-th
              >
              <b-th variant="secondary" class="text-right">
                {{ planejamentoMensal.getTotalInvestimentosFormatado() }}
              </b-th>
              <b-th variant="secondary" class="text-right">
                {{ planejamentoMensal.getPercentualInvestimentosFormatado() }}
              </b-th>
              <b-td variant="secondary" colspan="2"></b-td>
            </b-tr>
            <b-tr>
              <b-th variant="secondary" colspan="3" class="text-right"
                >Saldo</b-th
              >
              <b-th variant="secondary" class="text-right">{{
                planejamentoMensal.getSaldoFormatado()
              }}</b-th>
              <b-td variant="secondary" colspan="3"></b-td>
            </b-tr>
          </b-tfoot>
        </b-table-simple>
      </b-card-text>
    </b-card>
  </div>
</template>

<script>
import moment from "moment";
import { MonthPickerInput } from "vue-month-picker";
import { Money } from "v-money";
import { PlanejamentoMensal } from "~/models/PlanejamentoMensal";
import { PlanejamentoEvento } from '~/models/PlanejamentoEvento';

export default {
  components: { Money, MonthPickerInput },
  middleware: 'auth',
  data() {
    return {
      planejamentoMensal: new PlanejamentoMensal([]),
      showAguarde: false,
      breadcrumbList: [
        { text: "Acompanhamento", href: "#" },
        { text: "Listagem", active: true },
      ],
      optionsAlert: {
        message: "",
        variant: "success",
        timer: 0,
      },
      money: {
        decimal: ",",
        thousands: ".",
        prefix: "R$ ",
        precision: 2,
        masked: false,
      },
      eventoGrid: {
        fields: [
          { key: "data", label: "Data" },
          { key: "tipo", label: "Tipo" },
          { key: "nome", label: "Nome" },
          { key: "valor", label: "Valor" },
          { key: "acoes", label: "Ações" },
        ],
      },
    };
  },
  fetch() {
    const mesAno = this.mesAnoAtual; 
    const month = mesAno.mes;
    const year = mesAno.ano;

    this.findAllPlanejamentoEventos(month, year);
  },
  computed: {
    mesAnoAtual() {
      const month = moment().month();
      const year = moment().year();

      return {mes: month, ano: year}
    },
    planejamentoEventoSortList() {
      let planejamentoEventoList =
        this.planejamentoMensal.planejamentoEventoList;

      planejamentoEventoList = planejamentoEventoList.sort((a, b) => {
        return moment(b.data).isBefore(moment(a.data));
      });

      return planejamentoEventoList;
    },
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
    changeMes(date) {
      const mes = date.monthIndex - 1
      const ano = date.year

      this.findAllPlanejamentoEventos(mes, ano)
    },
    async findAllPlanejamentoEventos(month, year) {
      try {
        const result = await this.$axios.get('/api/acompanhamento', {params: {mes: month, ano: year}});
        this.planejamentoMensal.planejamentoEventoList = result.data.map(json => new PlanejamentoEvento(json))

      } catch (e) {
        window.console.log("error: " + e);
        this.error("Erro ao recuperar planejamento de eventos");
      }
    },
    validate(planejamentoEvento) {
      if (!planejamentoEvento.data) {
        this.error("Favor informar o campo Data");
        return false;
      }

      if (!planejamentoEvento.valor) {
        this.error("Favor informar o campo Valor");
        return false;
      }

      return true;
    },
    async save(planejamentoEvento) {
      if (!this.validate(planejamentoEvento)) {
        return false;
      }

      planejamentoEvento.realizado = true;
      planejamentoEvento.message = "Aguarde ...";

      try {
        const json = await this.$axios.post('/api/acompanhamento', planejamentoEvento);
        planejamentoEvento.setJson(json.data);

        this.success();
      } catch (e) {
        this.error("Erro ao salvar realização de evento");
      }

      planejamentoEvento.message = "";
    },
  },
};
</script>