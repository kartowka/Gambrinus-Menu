const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
	username: {
		type: String,
		required: true,
	},
	role: {
		type: String,
		default: 'admin',
	},
	password: {
		type: String,
		required: true,
	},
})

const User = mongoose.model('user', UserSchema)

module.exports = User
