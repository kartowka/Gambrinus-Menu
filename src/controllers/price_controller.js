const Price = require('../models/price_model')
const Homepage = require('../models/homepage')
const { roles } = require('../roles/roles')
const User = require('../models/admin_user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

exports.grantAccess = function (action, resource) {
	return async (req, res, next) => {
		try {
			var granted = true
			const user = await User.findById(req.params.id)
			var permission = roles.can(req.user.role)[action](resource)
			if (!permission.granted || !granted) {
				throw new UserException('You are not allowed to perform this action.')
			}
			next()
		} catch (error) {
			res.status(401).send(error.message)
		}
	}
}
exports.allowIfLoggedin = async (req, res, next) => {
	try {
		const user = res.locals.loggedInUser
		if (!user) {
			throw new UserException('You need to be logged in to access this route')
		}
		req.user = user
		next()
	} catch (error) {
		return res.redirect('/login')
	}
}

exports.hashPassword = async (password) => {
	return await bcrypt.hash(password, 10)
}

async function validatePassword(plainPassword, hashedPassword) {
	return await bcrypt.compare(plainPassword, hashedPassword)
}
exports.login = async (req, res, next) => {
	try {
		const { username, password } = req.body
		const user = await User.findOne({ username: username })
		if (!user) {
			throw new UserException('username doesn`t exist!')
		}
		const validPassword = await validatePassword(password, user.password)
		if (!validPassword) {
			throw new UserException('Password isn`t correct.')
		}
		const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
			expiresIn: '1d',
		})
		let options = {
			path: '/',
			sameSite: true,
			maxAge: 1000 * 60 * 60 * 24, // would expire after 24 hours
			httpOnly: true, // The cookie only accessible by the web server
		}
		res.cookie('x-access-token', accessToken, options)
		await User.findByIdAndUpdate(user._id, { accessToken })
		res.redirect('admin')
	} catch (error) {
		req.error = error.message
		next()
	}
}

exports.getPrices = async (req, res, next) => {
	const prices = await Price.find({})
	req.params.prices = prices
	next()
}
exports.getPrice = async (req, res, next) => {
	const edit_ID = await Price.findOne({ _id: req.params.id })
	req.params.edit_ID = edit_ID
	next()
}
exports.getHomepageDetails = async (req, res, next) => {
	const details = await Homepage.find({})
	req.params.homepage = details
	next()
}
exports.setHomepageDetails = async (req, res, next) => {
	const tel_show_split = '0' + req.body.tel.slice(5, -1)
	console.log(tel_show_split)
	let update = await Homepage.findByIdAndUpdate(req.body.id, {
		he_description: req.body.he_description,
		ru_description: req.body.ru_description,
		en_description: req.body.en_description,
		tel: req.body.tel,
		tel_show: tel_show_split,
		contact_details: req.body.contact_details,
	})
}
exports.addProduct = async (req, res, next) => {
	await new Price({
		product: req.body.product,
		he_name: req.body.he_name,
		he_description: req.body.he_description,
		ru_name: req.body.ru_name,
		ru_description: req.body.ru_description,
		en_name: req.body.en_name,
		en_description: req.body.en_description,
		price: req.body.price,
		tag: req.body.tag,
		recommended: req.body.recommended,
	}).save()
}
exports.updatePrice = async (req, res, next) => {
	// console.log(req.body)
	const productID = req.body.product_id
	let product = await Price.findByIdAndUpdate(productID, {
		he_name: req.body.he_name,
		he_description: req.body.he_description,
		ru_name: req.body.ru_name,
		ru_description: req.body.ru_description,
		en_name: req.body.en_name,
		en_description: req.body.en_description,
		price: req.body.price,
		tag: req.body.tag,
		recommended: req.body.recommended,
	})
	next()
}
exports.deleteProduct = async (req, res) => {
	const product_ID = req.body.delete_ID
	await Price.findByIdAndDelete(product_ID)
}
exports.denyIfLoggedin = async (req, res, next) => {
	try {
		const user = res.locals.loggedInUser
		if (user) {
			throw new UserException('You already loggedin.')
		} else {
			next()
		}
	} catch (error) {
		res.status(401).send(error.message)
	}
}

//! EXCEPTIONS

function UserException(message) {
	this.message = message
}
//!
