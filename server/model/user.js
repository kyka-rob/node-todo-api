const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const base64url = require('base64url')
const _ = require('lodash')

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

var User = mongoose.model('User', UserSchema)

module.exports = {User}