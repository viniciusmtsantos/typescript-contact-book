const modelLogin = require('../models/LoginModel')

exports.index = (req: any, res: any) => {
  if (req.session.user) return res.render('login-logged')
  return res.render('login')
}

exports.register = async function (req: any, res: any) {
  try {
    const login = new modelLogin(req.body)
    await login.register()

    if (login.errors.length > 0) {
      req.flash('errors', login.errors)
      req.session.save(function () {
        return res.redirect('/login/index')
      })
      return
    }

    req.flash('success', 'Seu usuario foi criado com sucesso')
    req.session.save(function () {
      return res.redirect('/login/index')
    })

  } catch (e) {
    console.log(e)
    res.render('404')
  }

}

exports.login = async function (req: any, res: any) {
  try {
    const login = new modelLogin(req.body)
    await login.login()

    if (login.errors.length > 0) {
      req.flash('errors', login.errors)
      req.session.save(function () {
        return res.redirect('/login/index')
      })
      return
    }

    req.flash('success', 'Usuário logado com sucesso')
    req.session.user = login.user
    req.session.save(function () {
      return res.redirect('/login/index')
    })

  } catch (e) {
    console.log(e)
    res.render('404')
  }
}

exports.logout = function (req: any, res: any) {
  req.session.destroy()
  res.redirect('/login/index')
}