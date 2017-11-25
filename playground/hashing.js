const {SHA256} = require('crypto-js')
const jwt = require('jsonwebtoken')
const base64url = require('base64url')

var data = {
    id: 11
}
var salt = base64url.encode('123abc')
var token = jwt.sign(data, salt)

console.log('Secret:',salt)
console.log('Token',token)

var decoded = jwt.verify(token, salt)
console.log('Decoded',decoded)

// var message = 'I am user number 4'
// var hash = SHA256(message).toString()

// console.log(`Message: ${message}`)
// console.log(`Hash: ${hash}`)

// var data = {
//     id: 4
// }
// var token = {
//     data,
//     hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// }

// // token.data.id = 5
// // token.data.hash = SHA256(JSON.stringify(token.data)).toString()

// var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString()

// if (resultHash === token.hash) {
//     console.log('Data was not change')
// } else {
//     console.log('Data was change. Do not trust')
// }