import moment from 'moment'
import { FormatUtil } from './FormatUtil'

export class PlanejamentoEvento {

    constructor(json) {
        this.id = null
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
        this.id = json.id
        this.tipo = json.tipo
        this.recorrente = json.recorrente
        this.nome = json.nome
        this.data = json.data
        this.valor = json.valor
        this.realizado = json.realizado
    }

    fill(evento, data) {
        this.id = evento.id
        this.tipo = evento.tipo
        this.recorrente = evento.recorrente
        this.nome = evento.nome
        this.data = data
        this.valor = evento.valor
        this.realizado = evento.realizado
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