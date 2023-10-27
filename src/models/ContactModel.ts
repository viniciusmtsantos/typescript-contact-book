const mongoose = require('mongoose');
const validator = require('validator');

const ContactSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  sobrenome: { type: String, required: false, default: '' },
  email: { type: String, required: false, default: '' },
  telefone: { type: String, required: false, default: '' },
  criadoEm: { type: Date, default: Date.now },
});

const ContactModel = mongoose.model('Contact', ContactSchema);

class Contact {
  body: any
  errors: any
  contact: any

  constructor(body: any) {
    this.body = body
    this.errors = []
    this.contact = null
  }

  cleanUp() {
    for (const key in this.body) {
      if (typeof this.body[key] != 'string') {
        this.body[key] = ''
      }
    }

    this.body = {
      nome: this.body.nome,
      sobrenome: this.body.sobrenome,
      email: this.body.email,
      telefone: this.body.telefone,
    }

  }

  async valida() {
    this.cleanUp()

    if (this.body.email && !validator.isEmail(this.body.email)) this.errors.push('Email invalido')
    if (!this.body.nome) this.errors.push('Nome é um campo obrigatório')
    if (!this.body.email && !this.body.telefone) this.errors.push('Pelo menos um contato precisa ser enviado: Email ou telefone')

  }

  async register() {
    this.valida()

    if (this.errors.length > 0) return

    this.contact = await ContactModel.create(this.body)
  }

  async edit(id: any) {
    if (typeof id != 'string') return

    this.valida()

    if (this.errors.length > 0) return

    this.contact = await ContactModel.findByIdAndUpdate(id, this.body, { new: true })
  }

  static async buscaPorId(id: any) {
    if (typeof id != 'string') return
    const contact = await ContactModel.findById(id)
    return contact
  }

  static async buscaContatos() {
    const contact = await ContactModel.find().sort({ criadoEm: 1 })
    return contact
  }

  static async deletePorId(id: any) {
    if (typeof id !== 'string') return
    const contact = await ContactModel.findOneAndDelete({ _id: id })
    return contact
  }
}

module.exports = Contact;
