const mongoose = require('mongoose');
const validator = require('validator')
const bcrypt = require('bcryptjs')

const LoginSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true }
});

const LoginModel = mongoose.model('Login', LoginSchema);

class Login {
  body: any;
  errors: any;
  user: any;

  constructor(body: any) {
    this.body = body
    this.errors = []
    this.user = null
  }

  cleanUp() {
    for (const key in this.body) {
      if (typeof this.body[key] != 'string') {
        this.body[key] = ''
      }
    }

    this.body = {
      email: this.body.email,
      password: this.body.password,
    }

  }

  async userExists() {
    const userEmail = await LoginModel.findOne({ email: this.body.email })

    if (userEmail) this.errors.push('Este email já foi cadastrado')
  }

  async valida() {
    this.cleanUp()

    if (!validator.isEmail(this.body.email)) this.errors.push('Email invalido')

    if (this.body.password.length < 3 || this.body.password.length > 50) this.errors.push('Senha entre 3 e 50 caracteres')

  }

  async register() {
    this.valida()

    if (this.errors.length > 0) return

    await this.userExists()

    if (this.errors.length > 0) return

    const salt = bcrypt.genSaltSync()
    this.body.password = bcrypt.hashSync(this.body.password, salt)

    try {
      this.user = await LoginModel.create(this.body)
    } catch (e) {
      console.log(e)
    }
  }

  async login() {
    this.valida()

    if (this.errors.length > 0) return

    this.user = await LoginModel.findOne({ email: this.body.email })

    if (!this.user) {
      this.errors.push('Usuário não existe')
      return
    }

    if (!bcrypt.compareSync(this.body.password, this.user.password)) {
      this.errors.push('Usuário e senha inválidos')
      this.user = null
      return
    }

    const salt = bcrypt.genSaltSync()
    this.body.password = bcrypt.hashSync(this.body.password, salt)

    try {
      this.user = await LoginModel.create(this.body)
    } catch (e) {
      console.log(e)
    }
  }
}

module.exports = Login;
