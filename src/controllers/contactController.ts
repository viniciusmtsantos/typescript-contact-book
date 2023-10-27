const Contato = require('../models/ContactModel')

exports.index = (req: any, res: any) => {
  res.render('contact', {
    contact: ''
  })
}

exports.register = async (req: any, res: any) => {
  try {
    const contact = new Contato(req.body)
    await contact.register()

    if (contact.errors.length > 0) {
      req.flash('errors', contact.errors)
      req.session.save(() => res.redirect(`/contact/index`))
      return
    }

    req.flash('success', 'Contato registro com sucesso')
    req.session.save(() => res.redirect(`/contact/index/${contact.contact._id}`))
    return

  } catch (e) {
    console.log(e)
    return res.render('404')
  }
}

exports.editIndex = async (req: any, res: any) => {
  if (!req.params.id) return res.render('404')

  const contact = await Contato.buscaPorId(req.params.id)

  if (!contact) return res.render('404')

  res.render('contact', { contact })
}

exports.edit = async (req: any, res: any) => {
  try {
    if (!req.params.id) return res.render('404')

    const contact = new Contato(req.body)

    await contact.edit(req.params.id)

    if (contact.errors.length > 0) {
      req.flash('errors', contact.errors)
      req.session.save(() => res.redirect(`/contact/index`))
      return
    }

    req.flash('success', 'Contato editado com sucesso')
    req.session.save(() => res.redirect(`/contact/index/${contact.contact._id}`))
    return
  } catch (e) {
    console.log(e)
    res.render('404')
  }
}

exports.delete = async (req: any, res: any) => {
  if (!req.params.id) return res.render('404')

  const contact = await Contato.deletePorId(req.params.id)

  if (!contact) return res.render('404')

  req.flash('success', 'Contato editado com sucesso')
  req.session.save(() => res.redirect(`/`))
  return
}