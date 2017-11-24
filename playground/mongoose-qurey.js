const {ObjectID} = require('mongodb')

const {mongoose} = require('./../server/db/mongoose')
const {Todo} = require('./../server/model/todo')
const {User} = require('./../server/model/user')

// var id = '5a17bebebdc5dd06d58983a41'
// if (!ObjectID.isValid(id)) {
//     console.log('Id not valid')
// }

// Todo.find({
//     _id: id
// }).then((todos) => {
//     console.log('todos',todos)
// })

// Todo.findOne({
//     _id: id
// }).then((todo) => {
//     console.log('todo',todo)
// })

// Todo.findById(id).then((todo) => {
//     if (!todo) {
//         return console.log('id not found')
//     }
//     console.log('todo by id',todo)
// }).catch((e) => console.log(e))

var id = '5a1766b50fe3510353845025'

User.findById(id).then((user)=>{
    if (!user) {
        return console.log('Unable to find user')
    }
    console.log(JSON.stringify(user, undefined, 2))
}, (e) => console.log(e))