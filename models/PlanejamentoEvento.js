import moment from 'moment'
import { FormatUtil } from './FormatUtil'
import { ObjectUtil } from './ObjectUtil'

export class PlanejamentoEvento {

    constructor(json) {
        this.eventoId = null
        this.tipo = ''
        this.recorrente = null
        this.nome = ''
        this.data = null
        this.valor = null
        this.realizado = false

        if (json) {
            this.setJson(json)
        }

        this.message = ''
    }

    setJson(json) {
        ObjectUtil.copy(this, json)
    }

    fill(evento, data) {
        this.eventoId = evento.id
        this.tipo = evento.tipo
        this.recorrente = evento.recorrente
        this.nome = evento.nome
        this.valor = evento.valor
        this.realizado = evento.realizado
        this.data = data
    }

    getDataFormatada() {
        return moment.utc(this.data).format('DD/MM/YYYY')
    }

    getTipoFormatado() {
        if (this.tipo === 'D') {
            return this.recorrente ? 'DF': 'DE'
        }

        return this.tipo
    }

    getValorFormatado() {
        if (this.valor) {
            return FormatUtil.formatCurrency(this.valor)
        }

        return ''
    }


}