const expressRoute = require('express');
const route = expressRoute.Router();
const homeController = require('./src/controllers/homeController');
const loginController = require('./src/controllers/loginController');
const contatoController = require('./src/controllers/contactController');

const { loginRequired } = require('./src/middlewares/middleware')

// Rotas da home
route.get('/', homeController.index);

// Rotas de Login
route.get('/login/index', loginController.index)
route.post('/login/register', loginController.register)
route.post('/login/login', loginController.login)
route.get('/login/logout', loginController.logout)

// Rotas de contato
route.get('/contact/index', loginRequired, contatoController.index)
route.get('/contact/index/:id', loginRequired, contatoController.editIndex)
route.post('/contact/register', loginRequired, contatoController.register)
route.post('/contact/edit/:id', loginRequired, contatoController.edit)
route.get('/contact/delete/:id', loginRequired, contatoController.delete)

module.exports = route;
