// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

// var obj = new ObjectID()
// console.log(obj)

MongoClient.connect('mongodb://localhost/TodoApp', (err, db) => {
    if (err) {
        return console.log('Unable to connect MongoDB server')
    }
    console.log('Connected to MongoDB server')

    // db.collection('Todos').insertOne({
    //     text: 'Something to do',
    //     completed: false
    // }, (err, result) => {
    //     if (err) {
    //         return console.log('Unable to insert todo', err)
    //     }
    //     console.log(JSON.stringify(result.ops, undefined, 2))
    // })

    // db.collection('Users').insertOne({
    //     name: 'Tee',
    //     age: 35,
    //     location: 'Bangkok'
    // }, (err, result) => {
    //     if (err) {
    //         return console.log('Unable to insert user', err)
    //     }
    //     // console.log(JSON.stringify(result.ops, undefined, 2))
    //     console.log(result.ops[0]._id.getTimestamp())
    // })
    
    db.close()
})