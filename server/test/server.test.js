const expect = require('expect')
const request = require('supertest')
const {ObjectID} = require('mongodb')

const {app} = require('./../server')
const {Todo} = require('./../model/todo')
const {User} = require('./../model/user')
const {todos, populateTodos, users, populateUsers} = require('./seed/seed')

beforeEach(populateUsers)
beforeEach(populateTodos)

describe('POST /todos', () => {
    it('Should create new to do', (done) => {
        var text = 'Test todo text'

        request(app)
        .post('/todos')
        .set('x-auth', users[0].tokens[0].token)
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
        .set('x-auth', users[0].tokens[0].token)
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
        .set('x-auth', users[0].tokens[0].token)
        .expect(200)
        .expect((res) => {
            expect(res.body.todos.length).toBe(1)
        })
        .end(done)
    })
})

describe('GET /todos/:id', () => {
    it('Should return todo doc', (done) => {
        request(app)
        .get(`/todos/${todos[0]._id.toHexString()}`)
        .set('x-auth', users[0].tokens[0].token)
        .expect(200)
        .expect((res) => {
            expect(res.body.todo.text).toBe(todos[0].text)
        })
        .end(done)
    })

    it('Should not return todo doc by another creator user', (done) => {
        request(app)
        .get(`/todos/${todos[0]._id.toHexString()}`)
        .set('x-auth', users[1].tokens[0].token)
        .expect(404)
        .end(done)
    })

    it('Should return 404 if to do not found', (done) => {
        var hexId = new ObjectID().toHexString()

        request(app)
        .get(`/todos/${hexId}`)
        .set('x-auth', users[0].tokens[0].token)
        .expect(404)
        .end(done)
    })

    it('Should return 404 for non-object id', (done) => {
        request(app)
        .get('/todos/123')
        .set('x-auth', users[0].tokens[0].token)
        .expect(404)
        .end(done)
    })
})

describe('DELETE /todos/:id', () => {
    it('Should remove to do', (done) => {
        var hexId = todos[1]._id.toHexString()
        request(app)
        .delete(`/todos/${hexId}`)
        .set('x-auth', users[1].tokens[0].token)
        .expect(200)
        .expect((res) => {
            expect(res.body.todo._id).toBe(hexId)
        })
        .end((err, res) => {
            if (!err)
                return done(err)
            
            Todo.findById(hexId).then((todo) => {
                expect(todo).toNotExist();
                done()
            }).catch((e) => done(e))
        })
    })

    it('Should not remove todo by another created user', (done) => {
        var hexId = todos[0]._id.toHexString()
        request(app)
        .delete(`/todos/${hexId}`)
        .set('x-auth', users[1].tokens[0].token)
        .expect(404)
        .end((err, res) => {
            if (!err)
                return done(err)
            
            Todo.findById(hexId).then((todo) => {
                expect(todo).toExist();
                done()
            }).catch((e) => done(e))
        })
    })

    it('Should return 404 if to do not found', (done) => {
        request(app)
        .delete('/todos/123')
        .set('x-auth', users[1].tokens[0].token)
        .expect(404)
        .end(done)
    })

    it('Should return 404 if objec id is invalid', (done) => {
        var hexId = new ObjectID().toHexString()
        request(app)
        .delete(`/todos/${hexId}`)
        .set('x-auth', users[1].tokens[0].token)
        .expect(404)
        .end(done)
    })
})

describe('PATCH /todos/:id', () => {
    it('Should update todo', (done) => {
        var newTodo = {
            _id: todos[1]._id.toHexString(),
            text: 'this should be new text',
            completed: true
        }
        request(app)
        .patch(`/todos/${newTodo._id}`)
        .set('x-auth', users[1].tokens[0].token)
        .send(newTodo)
        .expect(200)
        .expect((res)=>{
            expect(res.body.todo.text).toBe(newTodo.text)
            expect(res.body.todo.completedAt).toBeA('number')
            expect(res.body.todo.completed).toBe(true)
        })
        .end(done)
    })

    it('Should not update todo created by another user', (done) => {
        var newTodo = {
            _id: todos[0]._id.toHexString(),
            text: 'this should be new text',
            completed: true
        }
        request(app)
        .patch(`/todos/${newTodo._id}`)
        .set('x-auth', users[1].tokens[0].token)
        .send(newTodo)
        .expect(404)
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
        .set('x-auth', users[1].tokens[0].token)
        .send(newTodo)
        .expect((res) => {
            expect(res.body.todo.text).toBe(newTodo.text)
            expect(res.body.todo.completed).toBe(false)
            expect(res.body.todo.completedAt).toNotExist()
        })
        .end(done)
    })
})

describe('GET /users/me', () => {
    it('Should return user if authenticate',(done) => {
        request(app)
        .get('/users/me')
        .set('x-auth', users[0].tokens[0].token)
        .expect(200)
        .expect((res)=>{
            expect(res.body._id).toBe(users[0]._id.toHexString())
            expect(res.body.email).toBe(users[0].email)
        })
        .end(done)
    })

    it('Should return 401 if not authenticate', (done) => {
        request(app)
        .get('/users/me')
        .expect(401)
        .expect((res)=>{
            expect(res.body).toEqual({})
        })
        .end(done)
    })
})

describe('POST /users', ()=>{
    it('It should create user',(done)=>{
        var email = 'example@example.com'
        var password = '123abc'
        
        request(app)
        .post('/users')
        .send({email, password})
        .expect(200)
        .expect((res)=>{
            expect(res.headers['x-auth']).toExist()
            expect(res.body._id).toExist() 
            expect(res.body.email).toBe(email)
        })
        .end((err)=>{
            if (err) {
                return done(err)
            }
            User.findOne({email}).then((user) =>{
                expect(user).toExist()
                expect(user.password).toNotBe(password)
                done()
            }).catch((e) => done(e))
        })
    })

    it('It should return validate error if request invalid',(done)=>{
        request(app)
        .post('/users')
        .send({
            email: 'aaa', 
            password: '123'
        })
        .expect(400)
        .expect((res)=>{
            expect(res.headers['x-auth']).toNotExist()
        })
        .end(done)
    })

    it('It should not create user if email in user',(done)=>{
        request(app)
        .post('/users')
        .send({
            email: users[0].email,
            password: 'P@ssw0rd'
        })
        .expect(400)
        .expect((res)=>{
            expect(res.headers['x-auth']).toNotExist()
        })
        .end(done)
    })
})

describe('POST /users/login', () => {
    it('Should login user and return auth token', (done) => {
        request(app)
        .post('/users/login')
        .send({
            email: users[1].email,
            password: users[1].password
        })
        .expect(200)
        .expect((res) => {
            expect(res.headers['x-auth']).toExist()
        })
        .end((err, res) => {
            if(err) {
                return done(err)
            }
            
            User.findById(users[1]._id).then((user) => {
                expect(user.tokens[1]).toInclude({
                    access: 'auth',
                    token: res.headers['x-auth']
                })
                done()
            }).catch((e) => done(e))
        })
    })

    it('Should reject invalid login', (done)=>{
        request(app)
        .post('/users/login')
        .send({
            email: users[1].email,
            password: users[1].password + '1'
        })
        .expect(400)
        .expect((res) => {
            expect(res.headers['x-auth']).toNotExist()
        })
        .end((err, res) => {
            if(err) {
                return done(err)
            }
            
            User.findById(users[1]._id).then((user) => {
                expect(user.tokens.length).toBe(1)
                done()
            }).catch((e) => done(e))
        })
    })
})

describe('DELETE /users/me/token', ()=> {
    it('Should delete auth token on logout', (done)=>{
        request(app)
        .delete('/users/me/token')
        .set('x-auth', users[0].tokens[0].token)
        .expect(200)
        .end((err,res)=>{
            if(err){
                done(err)
            }
            User.findById(users[0]._id).then((user)=>{
                expect(user.tokens.length).toBe(0)
                done()
            }).catch((e)=>done(e))
        })
    })
})