import { ServiceLocalStorage } from './ServiceLocalStorage'

export class Facade {

  static getInstance() {
    return new ServiceLocalStorage()
  }
}