var express = require('express')
var bodyParser = require('body-parser')

var {mongoose} = require('./db/mongoose')
var {Todo} = require('./model/todo')
var {User} = require('./model/user')

var app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

app.post('/todos', (req, res) => {
    var newTodo = new Todo({
        text: req.body.text
    })

    newTodo.save().then((doc) => {
        res.send(doc)
    }, (e) => {
        res.status(400).send(e)
    })
})

app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({todos})
    }, (e) => {
        res.status(400).send(e)
    })
})

app.listen(3000, () => {
    console.log('started on port 3000')
})

module.exports = {app}