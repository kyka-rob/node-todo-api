const {ObjectID} = require('mongodb')

const {mongoose} = require('./../server/db/mongoose')
const {Todo} = require('./../server/model/todo')
const {User} = require('./../server/model/user')

// Todo.remove({}).then((result)=>{
//     console.log(result)
// })

// Todo.findOneAndRemove({_id: '5a1882631d4dc102ff290179'}).then((doc) => {
//     console.log('removeByOne',doc)
// })

Todo.findByIdAndRemove('5a1898a0771877067b588b4e').then((doc) => {
    console.log('removeByID',doc)
})