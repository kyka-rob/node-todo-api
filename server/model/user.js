const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const base64url = require('base64url')
const _ = require('lodash')
const bcrypt = require('bcryptjs')

var UserSchema = mongoose.Schema({
    email: {
        type: String,
        required: [true, 'email is required'],
        trim: true,
        minlength: 1,
        unique: true,
        validate: {
            validator: value => validator.isEmail(value),
            message: `{VALUE} is not valid email`
        }
    },
    password: {
        type: String,
        required: [true, 'password is required'],
        minlength: 6
    },
    tokens : [{
        access: {
            type: String,
            required: [true, 'access is required']
        },
        token: {
            type: String,
            required: [true, 'token is required']
        }
    }]
    
})

UserSchema.methods.toJSON = function() {
    var user =this
    var userObject = user.toObject()
    return _.pick(userObject, ['_id','email'])
}

UserSchema.methods.generateAuthToken = function() {
    var user = this
    var access = 'auth'
    var salt = base64url('123abc')
    var token = jwt.sign({_id: user._id.toHexString(), access}, salt).toString()

    user.tokens.push({access, token})

    return user.save().then(()=>{
        return token
    })
}

UserSchema.methods.removeToken = function(token) {
    var user = this
    return user.update({
        $pull: {
            tokens: {token}
        }
    })
}

UserSchema.statics.findByToken = function(token) {
    var user = this
    var decoded
    var salt = base64url('123abc')

    try {
        decoded = jwt.verify(token, salt)
    } catch(e) {
        // return new Promise((resolve, reject)=>{
        //     reject()
        // })
        return Promise.reject('Email and/or password is invalid')
    }
    
    return user.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    })
}

UserSchema.statics.findByCredentials = function (email, password) {
    var User = this
    return User.findOne({email}).then((user)=>{
        if(!user) {
            return Promise.reject('Not able to login')
        }
        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, res) => {
                if(res) {
                    resolve(user)
                } else {
                    reject('Unauthorized user')
                }
            })
        })
    })
    
}

UserSchema.pre('save', function(next) {
    var user = this
    
    if (user.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash
                next()
            })
        })
    } else {
        next()
    }
})

var User = mongoose.model('User', UserSchema)

module.exports = {User}