import { AbstractManager } from "./AbstractManager";
import { Evento } from "./Evento";

export class EventoManager extends AbstractManager {

  constructor() {
    super()
  }

  createModel(json) {
    return new Evento(json)
  }

}