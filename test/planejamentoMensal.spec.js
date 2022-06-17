import moment from 'moment'
import { PlanejamentoMensal } from '~/models/PlanejamentoMensal';
import { PlanejamentoEvento } from '~/models/PlanejamentoEvento';

let planejamentoMensal = null

describe('Planejamento mensal', () => {

    beforeAll(() =>	{
        const planejamentoEventoJsonList = [
            {id: 1, tipo: 'R', recorrente: true, nome: 'Salário dia 10',  
                data: moment('10/05/2022', 'DD/MM/YYYY').toDate(), valor: 7000.0
            },
            {id: 2, tipo: 'R', recorrente: true, nome: 'Salário dia 25', 
                data: moment('25/05/2022', 'DD/MM/YYYY').toDate(), valor: 8700.0 
            },
            {id: 3, tipo: 'D', recorrente: true, nome: 'Conta de energia', 
                data: moment('10/05/2022', 'DD/MM/YYYY').toDate(), valor: 700.0
            },
            {id: 4, tipo: 'D', recorrente: true, nome: 'Claro TV Internet', 
                data: moment('10/05/2022', 'DD/MM/YYYY').toDate(), valor: 250.0
            },
            {id: 5, tipo: 'D', recorrente: true, nome: 'Claro celular', 
                data: moment('10/05/2022', 'DD/MM/YYYY').toDate(), valor: 230.0
            },
            {id: 6, tipo: 'D', recorrente: false, nome: 'Vacina Bob', 
                data: moment('15/05/2022', 'DD/MM/YYYY').toDate(), valor: 120.0
            },
            {id: 7, tipo: 'D', recorrente: false, nome: 'Hortifruti', 
                data: moment('12/05/2022', 'DD/MM/YYYY').toDate(), valor: 260.0
            },
            {id: 8, tipo: 'I', recorrente: false, nome: 'Tesouro TPRE2025', 
                data: moment('12/05/2022', 'DD/MM/YYYY').toDate(), valor: 4000.0
            },
        ]

        const planejamentoEventoList = planejamentoEventoJsonList.map(json => new PlanejamentoEvento(json))
        planejamentoMensal = new PlanejamentoMensal(planejamentoEventoList)
    });

    test('deve calcular total de receitas', () => {
        expect(planejamentoMensal.totalReceitas()).toBe(15700.0)
    })

    test('deve calcular total de investimentos', () => {
        expect(planejamentoMensal.totalInvestimentos()).toBe(4000.0)
    })

    test('deve calcular total de despesas fixas', () => {
        expect(planejamentoMensal.totalDespesasFixas()).toBe(1180.0)
    })

    test('deve calcular total de despesas eventuais', () => {
        expect(planejamentoMensal.totalDespesasEventuais()).toBe(380.0)
    })

    test('deve calcular total de despesas', () => {
        expect(planejamentoMensal.totalDespesas()).toBe(1560.0)
    })

    test('deve calcular o saldo', () => {
        expect(planejamentoMensal.saldo()).toBe(10140.0)
    })

})