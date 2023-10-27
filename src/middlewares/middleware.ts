exports.middlewareGlobal = (req: any, res: any, next: any) => {
  res.locals.errors = req.flash('errors');
  res.locals.success = req.flash('success');
  res.locals.user = req.session.user
  next();
};

exports.outroMiddleware = (req: any, res: any, next: any) => {
  next();
};

exports.checkCsrfError = (err: any, req: any, res: any, next: any) => {
  if (err) {
    return res.render('404');
  }

  next()
};

exports.csrfMiddleware = (req: any, res: any, next: any) => {
  res.locals.csrfToken = req.csrfToken();
  next();
};

exports.loginRequired = (req: any, res: any, next: any) => {
  if (!req.session.user) {
    req.flash('errors', 'VocÊ precisa fazer login')
    req.session.save(() => res.redirect('/'))
    return
  }

  next()
}