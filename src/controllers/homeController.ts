const Contato = require('../models/ContactModel')

exports.index = async (req: any, res: any) => {
  const contacts = await Contato.buscaContatos()
  res.render('index', { contacts })
};