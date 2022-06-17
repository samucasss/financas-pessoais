export class AbstractManager {

  constructor() {
    this.modelList = []
    this.modelAtual = null
    this.edit = false
  }

  reset() {
    this.modelAtual = null
    this.edit = false
  }

  novo() {
    this.modelAtual = this.createModel()
    this.edit = true
  }

  add(modelJson) {
    this.modelList.push(this.createModel(modelJson))
  }

  editar(model) {
    this.modelAtual = model
    this.edit = true
  }

  update(modelJson) {
    let model = this.modelList.find(obj =>
      modelJson.id === obj.id)

      model.setJson(modelJson)
  }

  remove(model) {
    const index = this.modelList.indexOf(model)
    this.modelList.splice(index, 1)
  }

}