export class LocalStorage {

  constructor(key){
    this.key = key
  }

  findAll() {
    let modelList = []

    const modelListLocal = window.localStorage.getItem(this.key)
    if (modelListLocal) {
      modelList = JSON.parse(modelListLocal)
    }

    return modelList
  }

  save(model) {
    const modelList = this.findAll(this.key)

    const exists = modelList.some(obj => obj.id === model.id)
    if (exists) {
      const index = modelList.findIndex(obj => obj.id === model.id)
      modelList.splice(index, 1)
    }

    modelList.push(model)
    
    window.localStorage.setItem(this.key, JSON.stringify(modelList))
  }

  remove(model) {
    const modelList = this.findAll(this.key)

    const index = modelList.indexOf(model)
    modelList.splice(index, 1)

    window.localStorage.setItem(this.key, JSON.stringify(modelList))
  }
}