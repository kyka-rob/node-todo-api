const {ObjectID} = require('mongodb')
const jwt = require('jsonwebtoken')
const base64url = require('base64url')
const {Todo} = require('./../../model/todo')
const {User} = require('./../../model/user')

const userIdOne = new ObjectID()
const userIdTwo = new ObjectID()

const users = [{
    _id: userIdOne,
    email: 'kyka_rob@google.com',
    password: 'userPassOne',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userIdOne, access: 'auth'}, base64url.encode('123abc')).toString()
    }]
}, {
    _id: userIdTwo,
    email: 'jang@dev.apple.com',
    password: 'userPassTwo'
}]

const todos = [{
    _id: new ObjectID(),
    text: 'First to do test'
}, {
    _id: new ObjectID(),
    text: 'Second to do test',
    completed: true,
    completedAt: 8800
}]

const populateTodos = (done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos)
    }).then(() => done())
}

const populateUsers = (done) => {
    User.remove().then(() => {
        var user1 = new User(users[0]).save()
        var user2 = new User(users[1]).save()
        // This Promise not get fired until user1 and user2 were successfully to save
         return Promise.all([user1, user2])
    }).then(() => done())
}

module.exports = {todos, populateTodos, users, populateUsers}