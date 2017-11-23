// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost/TodoApp', (err, db) => {
    if (err) {
        return console.log('Unable to connect MongoDB server')
    }
    console.log('Connected to MongoDB server')

    // deleteMany
    // db.collection('Todos').deleteMany({text: 'Eat lunch'}).then((result)=>{
    //     console.log(result)
    // })

    // deleteOne
    // db.collection('Todos').deleteOne({text: 'Eat lunch'}).then((result) => {
    //     console.log(result)
    // })

    // findOneAndDelete
    // db.collection('Todos').findOneAndDelete({_id: new ObjectID('5a161e5d52fae086a7a2af14')}).then((result) => {
    //     console.log(result)
    // })
    
    // db.collection('Users').deleteMany({name: 'Tee'})

    db.collection('Users').findOneAndDelete({
        _id: new ObjectID('5a1608f6b405d30367ec63de')
    }).then((result) => {
        console.log(JSON.stringify(result, undefined, 2))
    })

    db.close()
})