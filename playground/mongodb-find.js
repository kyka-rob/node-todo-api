// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost/TodoApp', (err, db) => {
    if (err) {
        return console.log('Unable to connect MongoDB server')
    }
    console.log('Connected to MongoDB server')

    // db.collection('Todos').find({
    //     _id: new ObjectID('5a160c1952fae086a7a2ad69')
    // }).toArray().then((docs) => {
    //     console.log('Todos')
    //     console.log(JSON.stringify(docs, undefined, 2))
    // }, (err) => {
    //     console.log('Unable to fetch data', err)
    // })
    
    // db.collection('Todos').find().count().then((count) => {
    //     console.log(`Todos : ${count} items`)
    // }, (err) => {
    //     console.log('Unable to fetch data', err)
    // })

    db.collection('Users').find({
        name: 'Tee'
    }).toArray().then((docs) => {
        console.log('Users')
        console.log(JSON.stringify(docs, undefined, 2))
    }, (err) => {
        console.log('Unable to fetch data')
    })

    db.close()
})