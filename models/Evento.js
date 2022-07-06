import moment from 'moment'
import { FormatUtil } from './FormatUtil'
import { ObjectUtil } from './ObjectUtil'

export class Evento {

    constructor(json) {
        this.id = null
        this.data = moment().startOf('day').toDate()
        this.nome = ''
        this.tipo = ''
        this.recorrente = false
        this.tipoRecorrencia = ''
        this.valor = 0.0
        this.realizado = false

        if (json) {
            this.setJson(json)
        }
    }

    setJson(json) {
        ObjectUtil.copy(this, json)
    }

    getDataFormatada() {
        return moment.utc(this.data).format('DD/MM/YYYY')
    }

    getTipoFormatado() {
        if (this.tipo) {
            switch(this.tipo) {
                case 'R': return 'Receita'
                case 'D': return 'Despesa'
                case 'I': return 'Investimento'
            }
        }

        return ''
    }

    getRecorrenteFormatado() {
        return this.recorrente ? 'Sim' : 'Não'
    }

    getTipoRecorrenteFormatado() {
        if (this.tipoRecorrencia) {
            return this.tipoRecorrencia === 'M' ? 'Mensal' : 'Anual'
        }

        return ''
    }

    getValorFormatado() {
        if (this.valor) {
            return FormatUtil.formatCurrency(this.valor)
        }

        return ''
    }

    getRealizadoFormatado() {
        return this.realizado ? 'Sim' : 'Não'
    }

    
}