const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const flash = require('connect-flash')
const session = require('express-session')

const db = require('./models')
const app = express()
const port = 3000

app.engine('handlebars', handlebars({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(session({ secret: 'secret', resave: flash, saveUninitialized: false }))
app.use(flash())

app.use((req, res, next) => {
  res.locals.success_message = req.flash('success_message')
  res.locals.error_message = req.flash('error_message')
  next()
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

require('./routes')(app)

module.exports = app
