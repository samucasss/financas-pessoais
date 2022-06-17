import moment from 'moment'
import { LocalStorage } from './LocalStorage'
import { Evento } from '~/models/Evento';
import { PlanejamentoEvento } from '~/models/PlanejamentoEvento';

export class ServiceLocalStorage {

  static time = 1000

  static keyEvento = 'eventoList'
  static keyPlanejamentoEvento = 'planejamentoEventoList'

  async timer() {
    await new Promise(resolve => setTimeout(resolve, ServiceLocalStorage.time))
  }

  async findAllEventos() {
    await this.timer()

    const localStorage = new LocalStorage(ServiceLocalStorage.keyEvento)
    const eventoList = localStorage.findAll().map(json => new Evento(json))

    return eventoList
  }  

  async save(evento) {
    await this.timer()

    const eventoLocal = new Evento()
    Object.assign(eventoLocal, evento)

    if (!evento.id) {
      eventoLocal.id = Math.floor(Math.random() * 100)
    }

    const localStorage = new LocalStorage(ServiceLocalStorage.keyEvento)
    localStorage.save(eventoLocal)

    // se o evento foi realizado salvar a realizacao do evento
    const realizacaoEvento = new PlanejamentoEvento()
    realizacaoEvento.fill(eventoLocal, eventoLocal.data)
    this.saveRealizacaoEvento(realizacaoEvento)

    return eventoLocal
  }

  async remove(evento) {
    await this.timer()

    const localStorage = new LocalStorage(ServiceLocalStorage.keyEvento)
    localStorage.remove(evento)

    return 'OK'
  }

  async findAllPlanejamentoEventos(month, year) {
    await this.timer()

    const inicio = moment(new Date(year, month, 1))
    const fim = inicio.clone().endOf('month')
    window.console.log('inicio: ' + inicio.format('DD/MM/YYYY'))
    window.console.log('fim: ' + fim.format('DD/MM/YYYY'))

    // recupera as realizações de eventos do mes
    const localStorageRealizacao = new LocalStorage(ServiceLocalStorage.keyPlanejamentoEvento)
    let realizacaoEventoList = localStorageRealizacao.findAll().map(json => new PlanejamentoEvento(json))
    realizacaoEventoList = realizacaoEventoList.filter(obj => moment(obj.data).isBetween(inicio, fim))
    window.console.log('realizacaoEventoList: ' + JSON.stringify(realizacaoEventoList))

    const localStorage = new LocalStorage(ServiceLocalStorage.keyEvento)
    let eventoList = localStorage.findAll().map(json => new Evento(json))
    window.console.log('eventoList: ' + JSON.stringify(eventoList))

    // recupera apenas os eventos que não tenham realizacao
    const realizacaoEventoIds = realizacaoEventoList.map(obj => obj.id)
    eventoList = eventoList.filter(obj => !realizacaoEventoIds.includes(obj.id))
    window.console.log('eventoList nao realizados: ' + JSON.stringify(eventoList))

    // constroe a lista de planejamento de eventos a partir dos eventos armazenados  
    let planejamentoEventoList = []
    planejamentoEventoList = planejamentoEventoList.concat(realizacaoEventoList)
    
    // 1. Eventos nao recorrentes programados para o mes
    const eventoNaoRecorrenteList = eventoList.filter(obj => !obj.recorrente && 
      moment(obj.data).isBetween(inicio, fim))
    window.console.log('eventoNaoRecorrenteList: ' + JSON.stringify(eventoNaoRecorrenteList))

    for (const evento of eventoNaoRecorrenteList) {
      const planejamentoEvento = new PlanejamentoEvento()
      planejamentoEvento.fill(evento, evento.data)

      planejamentoEventoList.push(planejamentoEvento)
    }

    // 2. Eventos recorrentes mensais
    const eventoRecorrenteMensalList = eventoList.filter(obj => obj.recorrente && obj.tipoRecorrencia === 'M')
    window.console.log('eventoRecorrenteMensalList: ' + JSON.stringify(eventoRecorrenteMensalList))

    for (const evento of eventoRecorrenteMensalList) {
      const planejamentoEvento = new PlanejamentoEvento()

      const day = moment(evento.data).date()
      const data = moment(new Date(year, month, day)).toDate()

      planejamentoEvento.fill(evento, data)

      planejamentoEventoList.push(planejamentoEvento)
    }

    // 3. Eventos recorrentes anuais
    const eventoRecorrenteAnualList = eventoList.filter(obj => obj.recorrente && obj.tipoRecorrencia === 'A' && 
      moment(obj.data).month() === month)

    for (const evento of eventoRecorrenteAnualList) {
      const planejamentoEvento = new PlanejamentoEvento()

      const day = moment(evento.data).date()
      const data = moment(new Date(year, month, day)).toDate()

      planejamentoEvento.fill(evento, data)

      planejamentoEventoList.push(planejamentoEvento)
    }

    return planejamentoEventoList
  }  

  async saveRealizacaoEvento(planejamentoEvento) {
    await this.timer()

    const planejamentoEventoLocal = new PlanejamentoEvento()
    Object.assign(planejamentoEventoLocal, planejamentoEvento)

    const localStorage = new LocalStorage(ServiceLocalStorage.keyPlanejamentoEvento)
    localStorage.save(planejamentoEventoLocal)

    return planejamentoEventoLocal
  }


}