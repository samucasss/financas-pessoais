<template>
  <div>
    <b-breadcrumb v-if="!eventoManager.edit" :items="breadcrumbList"></b-breadcrumb>

    <span v-if="$fetchState.pending || showAguarde" style="color: red; float: right" >Aguarde ...</span>

    <b-alert 
      :variant="optionsAlert.variant" :show="optionsAlert.timer" dismissible @dismissed="optionsAlert.timer=0">
      {{ optionsAlert.message }}
    </b-alert>

    <b-button 
      v-if="!eventoManager.edit" v-b-tooltip.hover variant="outline-primary" style="margin-bottom: 10px"
      title="Novo evento" size="sm" @click="novo()">
        <b-icon icon="plus" aria-hidden="true"></b-icon>Novo
    </b-button>

    <EventoForm v-if="eventoManager.edit" :evento-manager="eventoManager" @success="success" @error="error" />

    <b-table 
      v-if="!eventoManager.edit"
      bordered striped hover 
      :fields="eventoGrid.fields" :items="eventoSortList">

      <template #cell(data)="data">
        {{ data.item.getDataFormatada() }}
      </template>

      <template #cell(tipo)="data">
        {{ data.item.getTipoFormatado() }}
      </template>

      <template #cell(recorrente)="data">
        {{ data.item.getRecorrenteFormatado() }}
      </template>

      <template #cell(tipoRecorrencia)="data">
        {{ data.item.getTipoRecorrenteFormatado() }}
      </template>

      <template #cell(valor)="data">
        {{ data.item.getValorFormatado() }}
      </template>

      <template #cell(realizado)="data">
        {{ data.item.getRealizadoFormatado() }}
      </template>

      <template #cell(acoes)="row">
        <b-button v-b-tooltip.hover variant="outline-primary" size="sm" title="Editar" @click="editar(row.item)">
          <b-icon icon="pencil-fill" aria-hidden="true"></b-icon>
        </b-button>
        <b-button v-b-tooltip.hover variant="outline-danger" size="sm" title="Remover" @click="remover(row.item)">
          <b-icon icon="trash-fill" aria-hidden="true"></b-icon>
        </b-button>
      </template>            

    </b-table>
  </div>  
</template>

<script>
import moment from "moment";
import EventoForm from './EventoForm'
import { Facade } from '@/services/Facade'
import { EventoManager } from '@/models/EventoManager'

export default {
  components: {
    EventoForm
  },  
  data() {
    return {
      service: Facade.getInstance(),
      eventoManager: new EventoManager(),
      showAguarde: false,
      breadcrumbList: [
        {text: 'Eventos', href: '#'},
        {text: 'Listagem', active: true},
      ],
      optionsAlert: {
        message: '',
        variant: 'success',
        timer: 0
      },
      eventoGrid: {
        fields: [
          {key: 'data', label: 'Data'},
          {key: 'nome', label: 'Nome'},
          {key: 'tipo', label: 'Tipo'},
          {key: 'recorrente', label: 'Recorrente?'},
          {key: 'tipoRecorrencia', label: 'Tipo recorrência'},
          {key: 'valor', label: 'Valor', thClass: 'text-right', tdClass: 'text-right'},
          {key: 'realizado', label: 'Realizado?'},
          {key: 'acoes', label: 'Ações'}
        ],
      },
    }
  },
  fetch() {
    this.findAllEventos()
  },  
  computed: {
    eventoSortList() {
      let eventoList = this.eventoManager.modelList;

      eventoList = eventoList.sort((a, b) => {
        return moment(b.data).isBefore(moment(a.data));
      });

      return eventoList;
    }
  },
  methods: {
    success() {
      this.optionsAlert = {message: 'Operação realizada com sucesso', variant: 'success', timer: 5}
    },
    error(msg) {
      this.optionsAlert = {message: msg, variant: 'danger', timer: 5}
    },
    async findAllEventos() {
      try {
        const eventoList = await this.service.findAllEventos() 
        this.eventoManager.modelList = eventoList

      } catch(e) {
        window.console.log('error: ' + e)
        this.error('Erro ao recuperar eventos')  
      }
    },
    novo() {
      this.eventoManager.novo()
    },
    editar(evento) {
      this.eventoManager.editar(evento)
    },
    remover(evento) {
      this.$bvModal.msgBoxConfirm('Tem certeza que deseja excluir o registro?')
        .then(value => {
            if (value) {
              this.remove(evento) 
            }
        })
        .catch(err => {
          window.console.log('Erro na confirmacao: ' + err)
        })    
    },
    async remove(evento) {
        this.showAguarde = true
        const retorno = await this.service.remove(evento)
        this.showAguarde = false

        if (retorno === 'OK') {
          this.eventoManager.remove(evento)
          this.success()

        } else {
          this.error('Erro ao remover evento')  
        }
    }
  }
}
</script>