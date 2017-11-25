const expect = require('expect')
const request = require('supertest')
const {ObjectID} = require('mongodb')

const {app} = require('./../server/server')
const {Todo} = require('./../server/model/todo')

var todos = [{
                _id: new ObjectID(),
                text: 'First to do test'
            }, {
                _id: new ObjectID(),
                text: 'Second to do test',
                completed: true,
                completedAt: 8800
            }]

beforeEach((done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos).then(() => done())
    })
})

describe('POST /todos', () => {
    it('Should create new to do', (done) => {
        var text = 'Test todo text'

        request(app)
        .post('/todos')
        .send({text})
        .expect(200)
        .expect((res) => {
            expect(res.body.text).toBe(text)
        })
        .end((err, res) => {
            if (err) {
                return done(err)
            }
            Todo.find({text}).then((todos) => {
                expect(todos.length).toBe(1)
                expect(todos[0].text).toBe(text)
                done()
            }).catch((e) => done(e))
        })
    })

    it('Should not create todo with invalid body data', (done) => {
        request(app)
        .post('/todos')
        .send({})
        .expect(400)
        .end((err, res) => {
            if (err) {
                return done(err)
            }
            
            Todo.find().then((todos) => {
                expect(todos.length).toBe(2)
                done()
            }).catch((e) => done(e))
        })
    })
})

describe('GET /todos', () => {
    it('Should get all todos', (done) => {
        request(app)
        .get('/todos')
        .expect(200)
        .expect((res) => {
            expect(res.body.todos.length).toBe(2)
        })
        .end(done)
    })
})

describe('GET /todos/:id', () => {
    it('Should return todo doc', (done) => {
        request(app)
        .get(`/todos/${todos[0]._id.toHexString()}`)
        .expect(200)
        .expect((res) => {
            expect(res.body.todo.text).toBe(todos[0].text)
        })
        .end(done)
    })

    it('Should return 404 if to do not found', (done) => {
        var hexId = new ObjectID().toHexString()

        request(app)
        .get(`/todos/${hexId}`)
        .expect(404)
        .end(done)
    })

    it('Should return 404 for non-object id', (done) => {
        request(app)
        .get('/todos/123')
        .expect(404)
        .end(done)
    })
})

describe('DELETE /todos/:id', () => {
    it('Should remove to do', (done) => {
        var hexId = todos[1]._id.toHexString()
        request(app)
        .delete(`/todos/${hexId}`)
        .expect(200)
        .expect((res) => {
            expect(res.body.todo._id).toBe(hexId)
        })
        .end((err, res) => {
            if (!err)
                return done(err)
            
            Todo.findById(newTodo._id).then((todo) => {
                expect(todo).toNotExist();
                done()
            }).catch((e) => done(e))
        })
    })

    it('Should return 404 if to do not found', (done) => {
        request(app)
        .delete('/todos/123')
        .expect(404)
        .end(done)
    })

    it('Should return 404 if objec id is invalid', (done) => {
        var hexId = new ObjectID().toHexString()
        request(app)
        .delete(`/todos/${hexId}`)
        .expect(404)
        .end(done)
    })
})

describe('PATCH /todos/:id', () => {
    it('Should update todo', (done) => {
        var newTodo = {
            _id: todos[0]._id.toHexString(),
            text: 'this should be new text',
            completed: true
        }
        request(app)
        .patch(`/todos/${newTodo._id}`)
        .send(newTodo)
        .expect(200)
        .expect((res)=>{
            expect(res.body.todo.text).toBe(newTodo.text)
            expect(res.body.todo.completedAt).toBeA('number')
            expect(res.body.todo.completed).toBe(true)
        })
        .end(done)
    })
    
    it('Should clear completedAt when todo is not complete', (done) => {
        var newTodo = {
            _id: todos[1]._id.toHexString(),
            text: 'this should be new text!!',
            completed: false
        }

        request(app)
        .patch(`/todos/${newTodo._id}`)
        .send(newTodo)
        .expect((res) => {
            expect(res.body.todo.text).toBe(newTodo.text)
            expect(res.body.todo.completed).toBe(false)
            expect(res.body.todo.completedAt).toNotExist()
        })
        .end(done)
    })
})