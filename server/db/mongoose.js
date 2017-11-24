const mongoose = require('mongoose')

mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost/TodoApp', { useMongoClient: true })

module.exports = {mongoose}