// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost/TodoApp', (err, db) => {
    if (err) {
        return console.log('Unable to connect MongoDB server')
    }
    console.log('Connected to MongoDB server')

    // db.collection('Todos').findOneAndUpdate({
    //     _id: new ObjectID('5a15a3cd18b8bb0556310b1b')
    // }, {
    //     $set: {
    //         completed: true
    //     }
    // }, {
    //     returnOriginal: false
    // }).then((result)=>{
    //     console.log(result)
    // })

    db.collection('Users').findOneAndUpdate({
        _id: new ObjectID('5a15a686ff8ce1061f284cef')
    }, {
        $set: {
            name: 'Tee'
        },
        $inc: {
            age: 1
        }
    }, {
        returnOriginal: false
    }).then((result) => {
        console.log(result)
    })

    // db.close()
})