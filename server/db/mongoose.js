const mongoose = require('mongoose')

mongoose.Promise = global.Promise
mongoose.connect(env.process.MONGODB_URI || 'mongodb://localhost/TodoApp', { useMongoClient: true })

module.exports = {mongoose}