import { FormatUtil } from "./FormatUtil"
import { TipoEventoEnum } from "./TipoEventoEnum"

export class PlanejamentoMensal {

    constructor(planejamentoEventoList) {
        this.planejamentoEventoList = planejamentoEventoList
    }

    listByTipo(tipo) {
        return this.planejamentoEventoList.filter(obj => obj.tipo === tipo)
    }

    receitas() {
        return this.listByTipo(TipoEventoEnum.RECEITA)
    }

    despesas() {
        return this.listByTipo(TipoEventoEnum.DESPESA)
    }

    despesasFixas() {
        return this.despesas().filter(obj => obj.recorrente)
    }

    despesasEventuais() {
        return this.despesas().filter(obj => !obj.recorrente)
    }

    investimentos() {
        return this.listByTipo(TipoEventoEnum.INVESTIMENTO)
    }

    totalReceitas() {
        let total = 0
        for (const receita of this.receitas()) {
            total += receita.valor
        }

        return total
    }

    totalDespesasFixas() {
        let total = 0
        for (const despesa of this.despesasFixas()) {
            total += despesa.valor
        }

        return total
    }

    totalDespesasEventuais() {
        let total = 0
        for (const despesa of this.despesasEventuais()) {
            total += despesa.valor
        }

        return total
    }

    totalDespesas() {
        let total = 0
        for (const despesa of this.despesas()) {
            total += despesa.valor
        }

        return total
    }

    totalInvestimentos() {
        let total = 0
        for (const investimento of this.investimentos()) {
            total += investimento.valor
        }

        return total
    }

    percentualInvestimentos() {
        return (this.totalInvestimentos() / this.totalReceitas()) * 100
    }

    percentualDespesasFixas() {
        return (this.totalDespesasFixas() / this.totalReceitas()) * 100
    }

    percentualDespesasEventuais() {
        return (this.totalDespesasEventuais() / this.totalReceitas()) * 100
    }

    saldo() {
        return this.totalReceitas() - this.totalInvestimentos() - this.totalDespesas()
    }

    getTotalReceitasFormatado() {
        return FormatUtil.formatCurrency(this.totalReceitas())
    }

    getTotalInvestimentosFormatado() {
        return FormatUtil.formatCurrency(this.totalInvestimentos())
    }

    getTotalDespesasFixasFormatado() {
        return FormatUtil.formatCurrency(this.totalDespesasFixas())
    }

    getTotalDespesasEventuaisFormatado() {
        return FormatUtil.formatCurrency(this.totalDespesasEventuais())
    }

    getSaldoFormatado() {
        return FormatUtil.formatCurrency(this.saldo())
    }

    getPercentualInvestimentosFormatado() {
        return FormatUtil.formatNumber(this.percentualInvestimentos()) + '%'
    }

    getPercentualDespesasFixasFormatado() {
        return FormatUtil.formatNumber(this.percentualDespesasFixas()) + '%'
    }

    getPercentualDespesasEventuaisFormatado() {
        return FormatUtil.formatNumber(this.percentualDespesasEventuais()) + '%'
    }

}